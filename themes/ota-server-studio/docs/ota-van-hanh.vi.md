# Bàn giao OTA dev: API, mobile, CI và vận hành

Đây là hướng dẫn chuẩn cho FE/mobile, người quản trị và người vận hành máy chủ OTA **bản dev**, thay nơi lưu bundle tạm thời. Không coi đây là phê duyệt phát hành production hoặc một hệ thống xác thực chữ ký bundle. Production phải dùng HTTPS và đi qua quy trình duyệt riêng.

**Nguồn chuẩn:** `zhst-community-themes/themes/ota-server/docs/ota-van-hanh.vi.md`. File `Downloads/ota-be-api.md` là bản bàn giao độc lập được đồng bộ từ nguồn này, không phải một hợp đồng khác. Các liên kết tương đối bên dưới được tính từ thư mục `docs/` của theme; khi đọc bản Downloads, mở hai repository cạnh nhau rồi tìm đường dẫn nguồn tương ứng.

## Ranh giới và nguồn đối chiếu

- Plugin sở hữu dữ liệu, kiểm tra đầu vào, lifecycle release, storage và workspace: [README plugin](../../../../zhst-community-plugins/plugins/ota-server/README.md), [service](../../../../zhst-community-plugins/plugins/ota-server/src/domain/service.ts), [types](../../../../zhst-community-plugins/plugins/ota-server/src/domain/types.ts).
- Theme sở hữu host và đường HTTP; plugin không tự mount `/ota/*`. [README theme](../README.md), [cấu hình Astro](../astro.config.mjs), [bindings/cron](../wrangler.jsonc), [runtime](../src/server/resources.ts) là nguồn cho cài đặt.
- API công khai: [handler app](../../../../zhst-community-plugins/plugins/ota-server/src/http/app.ts). API quản trị: [handler admin](../../../../zhst-community-plugins/plugins/ota-server/src/http/admin.ts), [gate và envelope](../../../../zhst-community-plugins/plugins/ota-server/src/http/shared.ts), [route session](../src/pages/api/ota/%5Baction%5D.ts).
- Form/schema: [validation](../../../../zhst-community-plugins/plugins/ota-server/src/domain/validation.ts); tạo manifest: [manifest](../../../../zhst-community-plugins/plugins/ota-server/src/domain/manifest.ts); nâng cấp dữ liệu: [migrations](../../../../zhst-community-plugins/plugins/ota-server/migrations/).

Các ví dụ dưới đây minh họa hợp đồng để tích hợp, không phải log của một lần deploy. Domain, ID, hash và signature trong ví dụ là dữ liệu giả lập công khai; không có credential thật.

## 1. Phân công FE/mobile, CI và backend

`app` là namespace đã đăng ký; `platform` là `android` hoặc `ios`; `channel` là nhánh/kênh dev, có thể chứa `/`; `binary` là phiên bản native tương thích, ví dụ `1.0.66+93` hoặc `1.6.6`. Migration khởi tạo có các slug `unitel-man`, `unitel-logistics`; danh sách đang dùng lấy từ workspace, không suy ra từ ví dụ.

**Ý nghĩa bắt buộc cập nhật:**

- `mandatory: true`: app mobile phải áp dụng bản cập nhật tương thích được chọn; không cung cấp lựa chọn bỏ qua bản đó.
- `mandatory: false`: cập nhật không bắt buộc; đây là mặc định khi publisher không gửi trường này.
- Backend chỉ lưu và trả cờ. Backend không thể tự cài bundle, buộc restart, chặn màn hình hay đổi bản đang chạy trên thiết bị. Mobile phải triển khai trải nghiệm bắt buộc/không bắt buộc, kiểm tra tính tương thích và cách xử lý lỗi tải/cài; không được coi `true` là bỏ qua kiểm tra an toàn.
- Mobile chọn đúng `app/platform/channel/binary`, đọc entry trong manifest, tải `file` từ cùng origin OTA, kiểm tra `size`/`sha256` trước khi áp dụng. Không suy diễn manifest rỗng hoặc DELETE là máy đã tự quay về bản native.

**Ba giá trị không được nhầm:**

| Giá trị | Vai trò và nơi sử dụng |
| --- | --- |
| `signature` | Metadata **công khai**, opaque, standard base64; có trong manifest và response. Server kiểm tra định dạng nhưng **không xác minh chữ ký**, không chọn Ed25519 hay thuật toán nào. Không đặt secret vào trường này. |
| Bearer push token | Credential **riêng tư**, theo app; gửi trong `Authorization`. Dùng cho publish, list bảo vệ và DELETE. Không nhúng vào app mobile. |
| `X-OTA-Upload-Key` | Credential **riêng tư** bổ sung, do admin sinh theo app; chỉ dùng với POST public releases khi app đã bật bảo vệ. Không phải `signature`, không đưa vào manifest/mobile. |

SHA-256 đối chiếu bytes với hash do publisher khai báo, giúp phát hiện dữ liệu sai; nó **không chứng minh nguồn gốc bundle** khi publisher có thể cung cấp cả bytes và hash. Chữ ký S3 SigV4 dùng truy cập storage cũng không phải chữ ký phát hành cho mobile. Nếu mobile cần trusted signing, đó là hợp đồng trust/key verification riêng, chưa được backend này cung cấp.

## 2. Cài local và mở admin

Yêu cầu Node theo [engines và scripts của theme](../package.json) và [plugin](../../../../zhst-community-plugins/plugins/ota-server/package.json): Node `^24.15.0` hoặc `>=26.0.0`. Hai repository phải là thư mục sibling vì dependency plugin là `file:`.

Chạy từ thư mục chứa hai repository:

```sh
cd zhst-community-plugins/plugins/ota-server
npm ci
npm run build
cd ../../../zhst-community-themes/themes/ota-server
npm ci
cp .env.example .env
npm run types
npm run migrate:local
npm run dev
```

Storage-plan local không cần `OTA_SECRET_KEY`. Khi cần private R2, tạo key mã hóa 32 byte theo [.env.example](../.env.example), lưu vào `.env` local theo quy định máy làm việc; không commit, không chép vào tài liệu/chat. Không tạo `.dev.vars` để tránh ghi đè `.env`. Key mã hóa này khác hoàn toàn upload key 64 byte và bearer token.

Mở trên trình duyệt local:

```text
http://localhost:4342/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin/plugins/ota-server/workspace
```

Đây là shortcut **development-only** của EmDash để khởi tạo CMS và session; không dùng cho production. Workspace ở `/_emdash/admin/plugins/ota-server/workspace` cần quyền `settings:manage`. Tạo bearer ở **Push tokens**; **Extra upload protection** trong cùng tab tạo/rotate upload key cho app. Các plaintext chỉ hiển thị một lần.

Dừng dev server trước khi build lại plugin: build xóa `dist/` trước khi ghi lại. Sau đổi server plugin, restart host. Các lệnh kiểm tra cho người tích hợp là `npm run check` trong plugin, rồi `npm run typecheck`, `npm run build`, `npm run verify:local` trong theme; nội dung kiểm tra do [scripts plugin](../../../../zhst-community-plugins/plugins/ota-server/package.json) và [verifier theme](../scripts/verify-local.mjs) sở hữu. Chúng không deploy lên cloud.

## 3. API public và hợp đồng release

Origin minh họa: `https://ota.example.com`. Không tự hardcode origin này vào app thật.

| Method và path | Xác thực | Kết quả thành công |
| --- | --- | --- |
| `GET /ota/{app}/{platform}/manifest.json` | Không | `200`, `{"channels":{...}}`; app hợp lệ chưa có release trả `{"channels":{}}`, `Cache-Control: no-cache` |
| `GET /ota/{app}/{platform}/{file}` | Không | Bundle, `200`; byte range hợp lệ có thể trả `206` |
| `POST /ota/{app}/{platform}/releases` | Bearer; thêm upload key nếu app đã cấu hình | `201`, **một entry manifest**, không có envelope `{ok,data}` |
| `GET /ota/{app}/{platform}/releases` | Bearer | `200`, cùng cấu trúc manifest; hỗ trợ lọc `channel`, `binary` |
| `DELETE /ota/{app}/{platform}/releases?channel=...&binary=...` | Bearer | `204`, không body; xóa toàn bộ release của cặp đó |

Đổi upload key không đổi auth download/list/DELETE. Backend không làm download private: manifest và bundle vẫn đọc ẩn danh.

### Form publish

Để `curl`/`FormData` tự đặt multipart boundary; không tự gán `Content-Type: multipart/form-data` thiếu boundary.

| Trường | Dữ liệu gửi | Ràng buộc tích hợp |
| --- | --- | --- |
| `bundle` | File | Bắt buộc, không rỗng; giới hạn theo `OTA_MAX_BUNDLE_BYTES` |
| `channel` | Text | Bắt buộc; tối đa 200 ký tự, không control character/backslash/whitespace đầu cuối |
| `binary` | Text | Bắt buộc; tối đa 64 ký tự, định dạng identifier theo schema |
| `sha256` | Text | Bắt buộc; 64 ký tự hex, tính từ đúng file đang gửi |
| `note` | Text | Tùy chọn, mặc định rỗng, tối đa 500 ký tự |
| `commit` | Text | Tùy chọn, mặc định rỗng, tối đa 64 ký tự, identifier theo schema |
| `signature` | Text | Tùy chọn, mặc định `""`; standard base64 canonical, tối đa 4096 ký tự. Giá trị 64 byte biểu diễn thành 88 ký tự là hợp lệ; **không bắt buộc mọi signature dài 88**. Không dùng base64url. |
| `mandatory` | Text | Tùy chọn; chỉ chuỗi chính xác `true` hoặc `false`, mặc định `false`. Response/manifest là **boolean JSON**, không phải chuỗi. Không gửi `1`, `0`, `TRUE` hoặc chuỗi rỗng. |

Nguồn ràng buộc là schema, không phải kích thước signature của ví dụ. Với `FormData`, dùng `form.set("mandatory", "true")` hoặc `"false"`; không dựa vào truthiness của chuỗi `"false"`.

### Response `201` và manifest

Ví dụ một entry; signature dưới đây chỉ là 64 byte tuần tự mã hóa base64, **không phải chữ ký đã ký/xác minh**:

```json
{
  "id": "20261008-091500",
  "file": "bundles/dev_delivery/1.0.66+93/20261008-091500.bundle",
  "sha256": "8a8adac45df963d4b491a18c17590cd376a53314c79d28bd27cb4a0e98a896d9",
  "size": 19707016,
  "note": "Sửa màn giao hàng",
  "commit": "e39c6d34",
  "signature": "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+Pw==",
  "mandatory": true,
  "branch": "dev/delivery",
  "createdAt": "2026-10-08T09:15:00.000Z"
}
```

Manifest bọc **chính entry đó** tại `channels["dev/delivery"]["1.0.66+93"]`. Nếu bỏ cả hai metadata khi publish, entry vẫn có `"signature":""` và `"mandatory":false`. `201` có `Cache-Control: no-store` và `Location` trỏ bundle. `file` là đường tương đối do server sinh; không tự tái tạo từ branch. Manifest `id` là release ID; admin có row `id` riêng dùng để rollback/delete từng release.

### Publish từ CI

CI lấy bearer/upload key từ secret store đã được phê duyệt và inject qua môi trường, không từ repository. `OTA_PUBLIC_SIGNATURE` là metadata công khai của artifact, không phải upload key. Không bật shell trace `set -x`, không log header hay response rotate.

Ví dụ Bash dưới đây dành cho app **đã bật upload protection**:

```sh
set -euo pipefail
BASE='https://ota.example.com'
APP='unitel-man'
PLATFORM='android'
CHANNEL='dev/delivery'
BINARY='1.0.66+93'
BUNDLE='./build/app.bundle'
: "${OTA_PUSH_TOKEN:?Inject bearer từ secret store}"
: "${OTA_UPLOAD_KEY:?Inject upload key của app từ secret store}"
SIGNATURE="${OTA_PUBLIC_SIGNATURE:-}"
MANDATORY="${OTA_MANDATORY:-false}"
SHA="$(node --input-type=module -e 'import {createHash} from "node:crypto"; import {readFileSync} from "node:fs"; process.stdout.write(createHash("sha256").update(readFileSync(process.argv[1])).digest("hex"))' "$BUNDLE")"

curl --fail-with-body -X POST "$BASE/ota/$APP/$PLATFORM/releases" \
  -H "Authorization: Bearer $OTA_PUSH_TOKEN" \
  -H "X-OTA-Upload-Key: $OTA_UPLOAD_KEY" \
  -F "bundle=@$BUNDLE" \
  --form-string "channel=$CHANNEL" \
  --form-string "binary=$BINARY" \
  --form-string "sha256=$SHA" \
  --form-string "signature=$SIGNATURE" \
  --form-string "mandatory=$MANDATORY" \
  --form-string 'note=nightly' \
  --form-string "commit=$(git rev-parse --short HEAD)"
```

Với app chưa cấu hình upload key, bỏ dòng kiểm tra `OTA_UPLOAD_KEY` và header `X-OTA-Upload-Key`; bearer vẫn bắt buộc. Không lấy signature để điền header, không tự sinh upload key ở CI. Khi bật bảo vệ lần đầu, chuẩn bị secret CI trước rồi chuyển publish sang hai credential; có thể tạm dừng publisher trong thời gian chuyển giao.

### Đọc, tải, list và gỡ

Dùng các biến `BASE`, `APP`, `PLATFORM`, `CHANNEL`, `BINARY` từ ví dụ publish. `FILE` phải lấy nguyên từ response/manifest của bản cần tải:

```sh
curl --fail-with-body "$BASE/ota/$APP/$PLATFORM/manifest.json"
FILE='bundles/dev_delivery/1.0.66+93/20261008-091500.bundle'
curl --fail-with-body -H 'Accept-Encoding: identity' \
  "$BASE/ota/$APP/$PLATFORM/$FILE" -o ./downloaded.bundle
curl --fail-with-body --get "$BASE/ota/$APP/$PLATFORM/releases" \
  -H "Authorization: Bearer $OTA_PUSH_TOKEN" \
  --data-urlencode "channel=$CHANNEL" --data-urlencode "binary=$BINARY"
```

File ví dụ không chứng minh có object đó trên máy thật. Trước khi áp dụng, đối chiếu byte length và SHA-256 tải về với entry. Download có `Content-Length`, `ETag` bằng sha256, `application/octet-stream`, không content coding và cache immutable; resume bằng một explicit range, ví dụ `Range: bytes=1048576-`. Không giả định suffix/multi-range được phục vụ từng phần; handler sở hữu quy tắc range.

**Lệnh phá hủy**, chỉ dùng khi đã duyệt đúng app/platform/channel/binary:

```sh
QUERY="$(node -e 'process.stdout.write(new URLSearchParams({channel:process.argv[1],binary:process.argv[2]}).toString())' "$CHANNEL" "$BINARY")"
curl --fail-with-body -X DELETE "$BASE/ota/$APP/$PLATFORM/releases?$QUERY" \
  -H "Authorization: Bearer $OTA_PUSH_TOKEN"
```

URL-encode `/` và `+` trong query; multipart text giữ nguyên. DELETE không phải rollback: nó gỡ mọi bản của cặp này và object tương ứng, không điều khiển bundle đã tải/cache hoặc bản đang chạy trên máy.

## 4. Admin API và upload protection

Admin API ở **cùng origin** `/api/ota/{action}`, dùng session EmDash có `settings:manage`, không dùng bearer publish để thay session. GET cần session; POST cần thêm `Origin` đúng origin và `X-EmDash-Request: 1`. JSON POST có `Content-Type: application/json`. Browser tự gửi cookie với `credentials: "same-origin"` và `Origin` khi POST; không tìm cách tự đặt `Origin` trong JavaScript. Multipart admin upload không tự đặt content type. [Client workspace](../../../../zhst-community-plugins/plugins/ota-server/src/admin/client.ts) là mẫu thực thi.

Envelope thành công: `{"ok":true,"data":...}`. Lỗi: `{"ok":false,"error":{"code":"...","message":"..."}}`. Admin response dùng `Cache-Control: private, no-store`.

### Xem trạng thái key, không đọc plaintext

`GET /api/ota/upload-key?app=unitel-man` trả `200`:

```json
{"ok":true,"data":{"app":"unitel-man","configured":false,"updatedAt":null}}
```

Khi đã cấu hình, `configured` là `true`, `updatedAt` là timestamp ISO. Không có API lấy lại key plaintext.

### Tạo lần đầu hoặc rotate

`POST /api/ota/upload-key-rotate`, JSON `{"app":"unitel-man"}`, trả `201`:

```text
{ok:true,data:{key:<plaintext chỉ có trong response này>,record:{app:"unitel-man",configured:true,updatedAt:<ISO timestamp>}}}
```

Đây là mô tả envelope, không phải JSON để gửi hay credential ví dụ. Key do server sinh bằng **64 byte ngẫu nhiên**, standard base64 **88 ký tự**, chỉ persist hash. Lần tạo đầu bật bảo vệ cho riêng app đó; không tạo thì vẫn dùng auth bearer hiện có. Rotate thay hash ngay: push **mới qua bước xác thực** phải dùng key mới. Request đã xác thực trước khi rotate có thể hoàn tất; không coi rotate là hủy upload đang chạy. Các release cũ, đường tải, list và DELETE không đổi. Không có grace period hoặc API tắt bảo vệ được mô tả ở đây.

Ví dụ chạy trong console của **workspace cùng origin, đã đăng nhập**; response chứa key chỉ giữ trong biến để chuyển vào secret store được duyệt, không `console.log` toàn response:

```js
const statusResponse = await fetch('/api/ota/upload-key?app=unitel-man', {
  credentials: 'same-origin'
});
const status = await statusResponse.json();
// Kiểm tra status.ok và status.data.configured trước khi quyết định rotate.
const rotationResponse = await fetch('/api/ota/upload-key-rotate', {
  method: 'POST',
  credentials: 'same-origin',
  headers: {'Content-Type': 'application/json', 'X-EmDash-Request': '1'},
  body: JSON.stringify({app: 'unitel-man'})
});
const rotation = await rotationResponse.json();
// Nếu rotation.ok, chuyển rotation.data.key vào secret store được duyệt.
// Không log/chụp màn hình/export biến này; mất key thì rotate lại, không truy hồi hash.
```

Thao tác thứ hai thực sự rotate, không phải kiểm tra read-only; chỉ chạy trong phạm vi đã được phép. Dùng controls workspace là lựa chọn thông thường. Nếu gọi ngoài browser, cần session cookie hợp lệ và hai header CSRF nêu trên; không chia sẻ cookie hay dùng nó làm secret CI dài hạn.

### Các tác vụ admin vận hành

Các payload khác đối chiếu [dispatch admin](../../../../zhst-community-plugins/plugins/ota-server/src/http/admin.ts) và schema trước khi tự động hóa:

- `GET info`, `GET releases` (lọc và cursor), `GET tokens`, `GET storage`, `GET audit`: workspace tra cứu nguồn hiện hành. Admin releases trả `{items,nextCursor}` trong `data`, không phải manifest.
- `POST token-create` JSON `{app,name}` trả `201` với `{token,record}` trong `data`; `POST token-revoke` JSON `{id}` thu hồi bearer. Tạo bearer mới không tự thu hồi các bearer cũ.
- `POST release-promote` JSON `{id}` chọn lại release theo **row ID admin**; `POST release-delete` JSON `{id}` xóa riêng bản đó. Không dùng manifest ID timestamp thay row ID.
- `POST release-upload` multipart gồm `app`, `platform`, `bundle`, `channel`, `binary`, `note`, `commit`, `signature`, `mandatory`. Backend tính sha256; session admin được phép upload **không cần bearer hoặc upload key**. Đây là đường quản trị được duyệt, không phải lối upload anonymous. Metadata có cùng validation/default như public publish.
- `POST app-save`, `POST storage-save`, `POST storage-test`, `POST purge`: thay đổi cấu hình hoặc dữ liệu; dùng workspace và đọc schema/service trước khi dùng API. Test storage ghi/đọc/xóa probe object, không phải thao tác read-only.

## 5. Release, rollback và retention

Trong phạm vi `app/platform/channel/binary`, backend giữ bản current và bản trước theo [service](../../../../zhst-community-plugins/plugins/ota-server/src/domain/service.ts) và [defaults](../../../../zhst-community-plugins/plugins/ota-server/src/domain/data.ts). Bản cũ hơn bị xóa; retention mặc định **14 ngày tính từ `createdAt`**, kể cả current. Push mới có sweep; [Worker scheduled](../src/worker.ts) hỗ trợ kênh ngừng push.

Gửi lại current với cùng bytes/sha/size **và cùng signature/mandatory** là replay: trả bản đã lưu với `201`, không nhân bản, **không làm mới `createdAt`**. Thay signature hoặc mandatory của cùng bytes tạo release mới, không âm thầm sửa metadata bản cũ. Không dùng replay làm keep-alive; cấu hình retention phù hợp lịch dev.

Runbook rollback: chọn đúng cặp trong **Releases**, xác nhận bản trước còn object và metadata phù hợp, chọn rollback/promote, rồi đọc lại manifest và thử app dev. Pointer thay đổi ngay; app chỉ nhận khi nó poll và thực thi logic cập nhật của mình. `signature`/`mandatory` đi cùng bản được chọn; promote không tự đổi cờ. Nếu bản cũ đã bị retention/delete, rollback không thể phục hồi bytes; cần artifact lưu trữ và publish lại hoặc restore đã duyệt.

Trước delete/retention purge, kiểm tra phạm vi và việc mất đường tải đối với thiết bị chưa tải. Bản đã nằm trong cache/máy không bị thu hồi bởi việc xóa ở server. Xóa metadata có thể thành công dù xóa object lỗi, để lại object orphan vẫn tính phí; kiểm tra log và dọn trong storage theo quyền vận hành, không suy ra đã hết object chỉ từ `204`.

## 6. Production đã được duyệt, nâng cấp và khôi phục

### Phê duyệt và cấu hình

Source community được merge **không đồng nghĩa** production được triển khai. Theo [maintainer review and promotion](../../../CONTRIBUTING.md#maintainer-review-and-promotion): chọn source revision chính xác, đánh giá trên tài nguyên cô lập, sau đó phê duyệt promotion riêng trước publication.

Tài liệu công khai này không giữ ID tài nguyên, URL dashboard riêng, tên account, đường vault hoặc credential. Người vận hành phải tra ở hồ sơ deployment/secret store **hạn chế quyền đã được tổ chức phê duyệt**, chọn rõ môi trường, identity và phạm vi. Repository không xác lập store hay ACL cụ thể đó: nếu chưa có nơi lưu/retrieval được duyệt thì bàn giao credential/deploy bị chặn; không dùng README, chat hay file Downloads làm fallback.

Tạo bản cấu hình production dựa trên [wrangler.jsonc](../wrangler.jsonc), thay tài nguyên local bằng tài nguyên được duyệt, đặt HTTPS `OTA_SITE_URL`, giữ binding `DB`, `OTA_DB`, `MEDIA` và cron phù hợp. Astro adapter bổ sung session binding; đối chiếu cấu hình Worker sinh ra khi build, không suy ra KV production từ file local. `DB` sở hữu CMS/users; `OTA_DB` sở hữu metadata OTA; `MEDIA` là storage-plan. Private R2 được lưu trong settings workspace, không phải upload key.

`OTA_CONFIG` chọn config cho **Astro build**. Các script `migrate:local`, `migrate:remote`, `types` hiện chỉ định `wrangler.jsonc`; đặt `OTA_CONFIG` không tự đổi target migration của chúng. Với bản production được duyệt, dùng config explicit, từ thư mục theme:

```sh
npx wrangler d1 migrations apply OTA_DB --remote --config ./wrangler.production.json
OTA_CONFIG=./wrangler.production.json npm run build
npx wrangler deploy --config dist/server/wrangler.json
```

Chỉ chạy lệnh remote khi đã xác nhận đúng account/identity, quyền deploy, database/config và có backup. Trước deploy, đối chiếu `dist/server/wrangler.json` sinh từ **bản build production được duyệt** với hồ sơ môi trường: tên Worker, bindings, origin, routes và tài nguyên. **Không deploy `dist/` vừa build bằng config local hoặc còn ID local giả lập.** Generated config là cùng đường cấu hình được preview/verifier sử dụng; dùng nó để deploy entry đã build, không bỏ qua adapter output bằng cách deploy `src/worker.ts` trực tiếp. Lệnh là hướng dẫn cho operator đã có phê duyệt, không phải quyền production được cấp bởi tài liệu.

Nếu dùng private R2, đặt key mã hóa runtime cho **đúng Worker production đã duyệt** bằng prompt tương tác, không đặt giá trị trong argument/file tài liệu/log:

```sh
npx wrangler secret put OTA_SECRET_KEY --config dist/server/wrangler.json
```

Lấy giá trị từ approved secret store; có thể không dùng private R2 cho tới khi secret này được cấu hình và settings đã save. [Wrangler Workers commands](https://developers.cloudflare.com/workers/wrangler/commands/workers/) sở hữu cú pháp `deploy`, `secret put` và `--config`. Production tạo admin bằng setup/login EmDash thông thường, không dev-bypass. Sau deploy, xác nhận session/admin quyền phù hợp và contract public trên origin thực tế bằng artifact dev được duyệt.

### Migration khi nâng cấp

Áp dụng **mọi migration chưa áp dụng** trong [thư mục migration plugin](../../../../zhst-community-plugins/plugins/ota-server/migrations/) trước phục vụ code mới; không chỉ chạy SQL khởi tạo. Migration metadata bổ sung `signature` và `mandatory`; dữ liệu cũ có `signature = ''`, `mandatory = 0`, serialize thành `"signature":""`, `"mandatory":false`.

Không chạy lại `ALTER TABLE` bằng tay hoặc coi upgrade là no-op. Dùng migration tracking của Wrangler; schema rollback tự động không được cung cấp. Nếu host gộp metadata vào CMS qua fallback `OTA_DB ?? DB`, người vận hành phải bảo đảm **đủ migration OTA trên DB thực tế đó** trước switch binding; việc chỉ áp dụng `0001` không đủ. Ưu tiên database OTA riêng như cấu hình mẫu.

### Secret rotation và đổi storage

- **Upload key:** tạm dừng publisher nếu cần cutover sạch, rotate trên đúng app, chuyển giá trị một lần vào store CI được duyệt, cập nhật publisher, kiểm tra push mới; key cũ không hợp lệ cho lần xác thực mới. Không ảnh hưởng release/download hiện có.
- **Bearer:** tạo token mới theo app, đổi secret CI, kiểm tra, rồi revoke token cũ theo ID. Hai token có thể cùng còn hiệu lực cho đến revoke; không coi create là rotation tự thu hồi.
- **R2 access credentials:** kiểm tra quyền bucket và endpoint, lưu credential mới qua workspace, Test connection và thử artifact dev; chỉ thu hồi credential cũ theo kế hoạch đã duyệt. Backend không trả lại secret plaintext.
- **`OTA_SECRET_KEY`:** dùng để mã hóa R2 secret tại rest, không phải auth upload. Khi đổi key runtime, phải nhập lại R2 secret và save bằng key mới, rồi test. Khoảng giữa đổi key và save có thể không giải mã được settings cũ; lên kế hoạch cửa sổ gián đoạn. Backup ciphertext không thay thế backup/retrieval key mã hóa trong approved secret store.
- **Storage switch:** release không ghi backend riêng cho từng object; đổi mode không migrate objects. Giữ backend cũ, backup/artifact và inventory hạn chế quyền; sau phê duyệt, drain release qua API ở backend cũ, đổi mode, test, publish lại artifact. Nếu phải giữ URL cũ thì chưa có công cụ migration object/metadata an toàn sẵn; không hứa switch là không gián đoạn. Không đổi setting rồi mong backend tự tìm bundle cũ.

### Backup/restore

Backup phải bao gồm CMS database/session-access state cần thiết, metadata OTA (apps, releases, pointer, token/upload-key hashes, settings, audit), objects trong đúng backend, deployment config và retrieval R2 credential/`OTA_SECRET_KEY` trong store được duyệt. Metadata không chứa lại plaintext bearer/upload key; mất plaintext thì tạo/rotate rồi cấp lại cho CI.

Đây là checklist khôi phục, **không phải bằng chứng đã có backup/restore tự động**. Trong cửa sổ được duyệt: dừng publish/purge/cron có thể làm snapshot lệch, snapshot database và objects cùng mốc, lưu ở nơi có ACL phù hợp; restore vào môi trường cô lập trước. Đối chiếu schema/migration history với revision ứng dụng, cấu hình backend/key mã hóa, rồi kiểm tra manifest, pointer, sha/size và tải từng artifact cần giữ trước mở traffic/publisher. Restore DB cũ có thể làm token đã revoke hoặc upload key cũ hoạt động trở lại; xét lại credential và rotate/revoke trước mở ghi. Không restore metadata trỏ object không còn.

Ngừng/deactivate plugin không tự xóa dữ liệu; xóa database cũng không xóa bucket. Removal phải có kế hoạch retention và dọn objects riêng sau phê duyệt. Công cụ snapshot/restore nhà cung cấp và vị trí lưu hạn chế quyền chưa được repository xác lập; phải lấy từ hồ sơ môi trường, không tự suy diễn lệnh restore.

## 7. Chẩn đoán và giới hạn runtime

App error là `{"error":{"code":"...","message":"..."}}`; admin error thêm `ok:false`. Đọc cả HTTP status và code; không log token/header/body nhạy cảm khi báo lỗi. [HTTP shared](../../../../zhst-community-plugins/plugins/ota-server/src/http/shared.ts), [multipart](../../../../zhst-community-plugins/plugins/ota-server/src/http/multipart.ts) và [storage adapters](../../../../zhst-community-plugins/plugins/ota-server/src/storage/) sở hữu mapping đầy đủ.

| Status/code điển hình | Cách xử lý |
| --- | --- |
| `400 INVALID_INPUT`, `INVALID_MULTIPART`, `INVALID_LENGTH`, `BUNDLE_MISSING` | Kiểm tra schema, boolean text chính xác, standard base64, multipart boundary và file không rỗng. |
| `400 SHA_MISMATCH` | Tính lại hash từ bytes thật đang gửi; không bỏ kiểm tra hash hoặc gửi một hash khác để che lỗi. |
| `401 AUTH_REQUIRED`, `TOKEN_INVALID`, `TOKEN_REVOKED` | Kiểm tra bearer đúng app từ store; tạo/cấp lại theo quyền admin, không lấy từ mobile. |
| `403 TOKEN_APP_MISMATCH` | Sai namespace app với bearer. |
| `403 UPLOAD_KEY_REQUIRED`, `UPLOAD_KEY_INVALID` | App đã bật bảo vệ: gửi đúng key mới của app qua header, không lấy public signature thay thế. |
| `403 FORBIDDEN`, `CSRF` | Admin session/quyền hoặc same-origin, `Origin`, `X-EmDash-Request` sai; không nới gate. |
| `404 APP_UNKNOWN`, `NOT_FOUND`, `BUNDLE_UNAVAILABLE`, `RELEASE_NOT_FOUND` | Kiểm tra app/path, expiry/delete và object/backend; không coi mọi manifest rỗng là lỗi. |
| `409 APP_DISABLED` | Quản trị kiểm tra app đang bị disable. |
| `405 METHOD_NOT_ALLOWED` | Dùng đúng GET/POST/DELETE và `Allow`; endpoint rotate không phải GET. |
| `413 BUNDLE_TOO_LARGE`, `BODY_TOO_LARGE` | Giảm bundle hoặc điều chỉnh ceiling sau khi đánh giá bộ nhớ host, kể cả multipart overhead. |
| `415 UNSUPPORTED_MEDIA_TYPE`, `CONTENT_TYPE` | Public upload cần multipart đúng boundary; JSON admin cần application/json. |
| `400/503 SECRET_KEY_MISSING`, `500 SECRET_UNREADABLE` | Kiểm tra runtime key mã hóa, restore/rotation và nhập lại R2 secret qua workspace. |
| `502 STORAGE_UNAUTHORIZED`, `STORAGE_MISSING`, `STORAGE_FAILED`; `503 STORAGE_NOT_CONFIGURED` | Kiểm tra mode, binding, endpoint/bucket và quyền credential trong hồ sơ hạn chế quyền; chạy storage test được duyệt. |
| `500 INTERNAL_ERROR`, `PUSH_FAILED`; `503 CONFIGURATION_ERROR` | Tra runtime log đã sanitize theo môi trường và request/time window, migration/binding/config đúng; không công bố stack/secret. |

Ceiling mặc định 100 MiB là giới hạn ứng dụng, **không bảo đảm** Worker chịu được upload cỡ đó. Parser giữ bundle trong bộ nhớ để hash/upload; khi không có declared length, tăng buffer có thể tạo copy tạm. Tính cả overhead/concurrency và giới hạn isolate; chọn ceiling thấp hơn (ví dụ khoảng 64 MiB hoặc thấp hơn sau đo) cho Workers. Không có streaming upload end-to-end hay Node host hoàn chỉnh được bàn giao ở đây.

Local verifier dùng Worker build và D1/R2 local riêng dưới `.wrangler/verify`, không xác nhận cloud production. Tests SigV4 hoặc local storage **không chứng minh private R2 live**. Người vận hành phải dùng bucket riêng được duyệt, Test connection, publish/read/download/delete artifact dev và ghi receipt đã redacted ở nơi hạn chế quyền. Cũng cần kiểm tra cache/content-length/range và memory/cron trên môi trường thật trước kết luận sẵn sàng; tài liệu này không ghi nhận kết quả chạy production.

Thông tin còn cần từ hồ sơ môi trường: approved secret store/ACL, deployment approval và identity, backup/restore route, bằng chứng private R2/Worker production và xác nhận mobile đã thực thi `mandatory`. Thiếu các dữ liệu này không ngăn đọc hợp đồng/local setup, nhưng ngăn tuyên bố triển khai production hoặc bắt buộc cập nhật end-to-end đã được chứng minh.
