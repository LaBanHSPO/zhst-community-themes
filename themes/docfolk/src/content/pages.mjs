import { endpoints, webhook, operationFor, schemaRows, localize } from './api.mjs';

const text = (en, vi) => ({ en, vi });
const code = (language, value) => `\n\`\`\`${language}\n${typeof value === 'string' ? value : JSON.stringify(value, null, 2)}\n\`\`\`\n`;
const table = (headers, rows) => `\n\n| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${rows.map(row => `| ${row.map(cell => String(cell).replaceAll('|', '\\|').replaceAll('\n', ' ')).join(' | ')} |`).join('\n')}\n\n`;
const section = (heading, body) => `\n## ${heading}\n\n${body}\n`;

const metadata = [
  ['overview', 1, 'Getting started', text('Introduction', 'Giới thiệu'), text('Understand the Orbit API, choose an environment, and make your first request.', 'Tìm hiểu API Orbit, chọn môi trường và thực hiện yêu cầu đầu tiên.')],
  ['authentication', 2, 'Getting started', text('Authentication', 'Xác thực'), text('Create an API token, send it as a bearer token, and keep environments separate.', 'Tạo token API, gửi dưới dạng bearer token và tách biệt các môi trường.')],
  ['webhooks', 3, 'Guides', text('Webhooks', 'Webhook'), text('Receive project events, verify the token, and acknowledge delivery safely.', 'Nhận sự kiện dự án, xác thực token và xác nhận an toàn.')],
  ['list-projects', 4, 'API reference', text('List projects', 'Liệt kê dự án'), text('Page through projects with a cursor and filter by status.', 'Duyệt danh sách dự án bằng con trỏ và lọc theo trạng thái.')],
  ['create-project', 5, 'API reference', text('Create a project', 'Tạo dự án'), text('Create a project in a region and read the created resource.', 'Tạo dự án trong một vùng và đọc tài nguyên vừa tạo.')],
  ['get-project', 6, 'API reference', text('Get a project', 'Lấy một dự án'), text('Retrieve a single project by identifier.', 'Lấy một dự án theo mã định danh.')],
  ['errors', 7, 'Resources', text('Errors and limits', 'Lỗi và giới hạn'), text('HTTP status codes, rate limits, pagination, and idempotency notes.', 'Mã trạng thái HTTP, giới hạn tần suất, phân trang và ghi chú idempotency.')],
  ['ai-tools', 8, 'Resources', text('Use with AI coding tools', 'Dùng với công cụ lập trình AI'), text('Give Claude, Codex, or Cursor scoped documentation and verifiable API contracts.', 'Cung cấp cho Claude, Codex hoặc Cursor tài liệu đúng phạm vi và hợp đồng API có thể kiểm chứng.')],
];

const notes = {
  'list-projects': text(
    'Projects are returned newest first. Use `limit` and the opaque `nextCursor` for pagination: request the next page with `cursor=<nextCursor>` and stop when `nextCursor` is `null`. Do not build cursors yourself or treat them as stable identifiers.\n\n`status` filters by lifecycle state. Omit it to return every status. The endpoint returns `items` and `nextCursor`; there is no total count.',
    'Dự án trả về mới nhất trước. Dùng `limit` và `nextCursor` mờ để phân trang: gọi trang kế tiếp với `cursor=<nextCursor>` và dừng khi `nextCursor` là `null`. Không tự tạo con trỏ hoặc coi chúng là mã ổn định.\n\n`status` lọc theo trạng thái vòng đời. Bỏ qua để trả mọi trạng thái. Endpoint trả `items` và `nextCursor`; không có tổng số lượng.'),
  'create-project': text(
    'Send `name` and optionally `region`; `region` defaults to `us`. A successful response echoes the stored resource, including `id`, `status`, and `createdAt`.\n\nUse a client-generated correlation value if you retry after a timeout, and reconcile before creating a duplicate. The sample API does not document a server-enforced idempotency key.',
    'Gửi `name` và tùy chọn `region`; `region` mặc định `us`. Phản hồi thành công trả lại tài nguyên đã lưu, gồm `id`, `status` và `createdAt`.\n\nNếu gửi lại sau timeout, dùng một giá trị đối soát do client tạo và đối chiếu trước khi tạo trùng. API mẫu không nêu khóa idempotency do máy chủ đảm bảo.'),
  'get-project': text(
    'Use the `id` returned by create-project or list-projects. A project the token cannot see returns `404`, not `403`, so do not infer existence from the status code alone.',
    'Dùng `id` trả về khi tạo dự án hoặc khi liệt kê. Dự án mà token không thấy sẽ trả `404`, không phải `403`, nên không suy ra sự tồn tại chỉ từ mã trạng thái.'),
};

function sharedHeaders(language) {
  return table(language === 'vi' ? ['Header', 'Yêu cầu', 'Giá trị / ý nghĩa'] : ['Header', 'Requirement', 'Value / meaning'], [
    ['Authorization', language === 'vi' ? 'Bắt buộc' : 'Required', language === 'vi' ? '`Bearer ${API_TOKEN}`: token của môi trường đã chọn' : '`Bearer ${API_TOKEN}`: token for the selected environment'],
    ['Content-Type', language === 'vi' ? 'Khi có body JSON' : 'With a JSON body', 'application/json'],
    ['Accept', language === 'vi' ? 'Nên gửi' : 'Recommended', 'application/json'],
    ['Accept-Language', language === 'vi' ? 'Tùy chọn' : 'Optional', '`en`, `vi`, `km`, `lo`, `my`'],
  ]);
}

function curlFor(endpoint, language) {
  let command = `curl --request ${endpoint.method} "\${BASE_URL}${endpoint.examplePath || endpoint.path}" \\\n  --header "Authorization: Bearer \${API_TOKEN}" \\\n  --header "Accept-Language: ${language}" \\\n  --header "Accept: application/json"`;
  if (endpoint.request) command += ' \\\n  --header "Content-Type: application/json" \\\n  --data @request.json';
  return code('bash', command);
}

function fieldTable(schema, language) {
  const rows = schemaRows(schema, language);
  return rows.length ? table(language === 'vi' ? ['Field', 'Kiểu', 'Bắt buộc', 'Mô tả'] : ['Field', 'Type', 'Required', 'Description'], rows) : localize(schema, language).description;
}

function apiBody(key, language) {
  const endpoint = endpoints[key];
  const vi = language === 'vi';
  let body = code('http', `${endpoint.method} /v1${endpoint.path}`);
  body += section(vi ? 'Ghi chú' : 'Notes', notes[key][language]);
  body += section(vi ? 'Header xác thực' : 'Authentication headers', sharedHeaders(language));
  if (endpoint.parameters?.length) body += section(vi ? 'Tham số đường dẫn và truy vấn' : 'Path and query parameters', table(vi ? ['Tên', 'Vị trí', 'Bắt buộc', 'Mô tả'] : ['Name', 'Location', 'Required', 'Description'], endpoint.parameters.map(parameter => [parameter.name, parameter.in, parameter.required ? (vi ? 'Có' : 'Yes') : (vi ? 'Không' : 'No'), localize(parameter, language).description])));
  if (endpoint.request) {
    body += section(vi ? 'Các field request' : 'Request fields', localize(endpoint.request, language).description + fieldTable(endpoint.request, language));
    body += section(vi ? 'Ví dụ body JSON' : 'Example JSON body', (vi ? 'Lưu thành `request.json`; thay các giá trị ví dụ bằng giá trị thật của bạn.' : 'Save as `request.json`; replace the example values with real ones.') + code('json', endpoint.requestExample));
  }
  body += section(vi ? 'Ví dụ cURL' : 'cURL example', (vi ? '`BASE_URL` là base URL của môi trường đã chọn. Giữ token trong biến môi trường, không dán vào tài liệu.' : '`BASE_URL` is the base URL of the selected environment. Keep the token in an environment variable, never in documentation.') + curlFor(endpoint, language));
  body += section(vi ? 'Ví dụ phản hồi' : 'Example response', (vi ? 'Minh họa cấu trúc; không phải dữ liệu thật hay cam kết.' : 'Illustrative shape; not live data or a guarantee.') + code('json', endpoint.responseExample));
  body += section(vi ? 'Các field phản hồi' : 'Response fields', fieldTable(endpoint.response, language));
  body += section(vi ? 'Xử lý lỗi' : 'Error handling', vi ? 'Xem [lỗi và giới hạn](errors) để biết mã HTTP, giới hạn tần suất và ghi chú idempotency.' : 'See [errors and limits](errors) for HTTP codes, rate limits, and idempotency notes.');
  return body;
}

function overview(language) {
  const vi = language === 'vi';
  let body = section(vi ? 'Giới thiệu' : 'What this is', vi ? 'Orbit là một API quản lý dự án mẫu dùng để minh họa một cổng tài liệu Docfolk. Nội dung này là ví dụ biên tập: tên, mã và phản hồi là giả lập, không phải hợp đồng của một dịch vụ thật.' : 'Orbit is a sample project-management API used to demonstrate a Docfolk documentation portal. The content is an editorial example: names, identifiers, and responses are synthetic, not a real service contract.');
  body += section(vi ? 'Môi trường và base URL' : 'Environments and base URL', table(vi ? ['Môi trường', 'BASE_URL'] : ['Environment', 'BASE_URL'], [['Sandbox', 'https://sandbox.api.orbit.example/v1'], ['Production', 'https://api.orbit.example/v1']]) + (vi ? 'Mỗi môi trường có token riêng. Không dùng chéo sandbox và production.' : 'Each environment has its own token. Do not share tokens between sandbox and production.'));
  body += section(vi ? 'Yêu cầu đầu tiên' : 'First request', (vi ? 'Lưu base URL và token trong môi trường, rồi liệt kê dự án:' : 'Keep the base URL and token in your environment, then list projects:') + code('bash', 'export BASE_URL="https://sandbox.api.orbit.example/v1"\n# API_TOKEN must be supplied by your private environment.\ncurl "$BASE_URL/projects?limit=20" \\\n  --header "Authorization: Bearer ${API_TOKEN}" \\\n  --header "Accept: application/json"'));
  body += section(vi ? 'Luồng tích hợp' : 'Integration flow', (vi ? '1. [Tạo token](authentication) và chọn môi trường.\n2. [Tạo dự án](create-project) hoặc [liệt kê](list-projects) dự án hiện có.\n3. [Lấy một dự án](get-project) khi cần chi tiết.\n4. [Đăng ký webhook](webhooks) để nhận sự kiện.\n5. Đối chiếu [mã lỗi và giới hạn](errors) trước khi lên production.' : '1. [Create a token](authentication) and choose an environment.\n2. [Create a project](create-project) or [list](list-projects) existing ones.\n3. [Get a project](get-project) when you need its details.\n4. [Register a webhook](webhooks) to receive events.\n5. Review [errors and limits](errors) before going to production.'));
  body += section(vi ? 'Trình tự request' : 'Request sequence', code('mermaid', vi ? 'sequenceDiagram\n  participant C as Ứng dụng\n  participant A as Orbit API\n  C->>A: POST /projects\n  A-->>C: id và trạng thái\n  C->>A: GET /projects\n  A-->>C: items và nextCursor\n  A->>C: POST webhook sự kiện\n  C-->>A: HTTP 200 xác nhận' : 'sequenceDiagram\n  participant C as Your app\n  participant A as Orbit API\n  C->>A: POST /projects\n  A-->>C: id and status\n  C->>A: GET /projects\n  A-->>C: items and nextCursor\n  A->>C: POST webhook event\n  C-->>A: HTTP 200 acknowledgement'));
  return body;
}

function authentication(language) {
  const vi = language === 'vi';
  let body = section(vi ? 'Token API' : 'API tokens', vi ? 'Tạo token trong bảng điều khiển và gửi trong header `Authorization` dưới dạng bearer. Mỗi môi trường cấp token riêng; gọi sandbox bằng token sandbox và production bằng token production.' : 'Create a token in the dashboard and send it in the `Authorization` header as a bearer token. Each environment issues its own token; call the sandbox with a sandbox token and production with a production token.');
  body += sharedHeaders(language);
  body += section(vi ? 'Ví dụ' : 'Example', (vi ? 'Không lưu token trong mã nguồn hay prompt AI. Đặt trong biến môi trường ở phía máy chủ.' : 'Never store the token in source code or AI prompts. Keep it in a server-side environment variable.') + code('bash', 'curl "$BASE_URL/projects" \\\n  --header "Authorization: Bearer ${API_TOKEN}" \\\n  --header "Accept: application/json"'));
  body += section(vi ? 'Xác thực và phân quyền' : 'Authentication and access', table(vi ? ['Trường hợp', 'Kết quả'] : ['Case', 'Result'], [['Thiếu header Authorization', '`401 Unauthorized`'], ['Token sai hoặc hết hạn', '`401 Unauthorized`'], ['Token đúng nhưng không có quyền', '`403 Forbidden`'], ['Tài nguyên ngoài phạm vi token', '`404 Not Found`']]));
  body += section(vi ? 'Sơ đồ xác thực' : 'Authentication diagram', code('mermaid', vi ? 'flowchart LR\n  A["Ứng dụng"] --> B["Authorization: Bearer token"]\n  B --> C{"Token hợp lệ?"}\n  C -->|Không| D["401"]\n  C -->|Có| E{"Có quyền?"}\n  E -->|Không| F["403"]\n  E -->|Có| G["Xử lý yêu cầu"]' : 'flowchart LR\n  A["Your app"] --> B["Authorization: Bearer token"]\n  B --> C{"Token valid?"}\n  C -->|No| D["401"]\n  C -->|Yes| E{"Authorized?"}\n  E -->|No| F["403"]\n  E -->|Yes| G["Handle request"]'));
  return body;
}

function webhooksBody(language) {
  const vi = language === 'vi';
  let body = code('http', 'POST ${WEBHOOK_URL}');
  body += section(vi ? 'Hợp đồng gửi' : 'Delivery contract', vi ? 'Webhook gửi sự kiện vòng đời dự án tới endpoint HTTPS do bạn đăng ký. Sự kiện có thể được gửi lại; hãy chống trùng và không để sự kiện cũ làm lùi trạng thái mới.' : 'The webhook delivers project lifecycle events to an HTTPS endpoint you register. Events can be redelivered; deduplicate them and never let an older event regress a newer state.');
  body += section(vi ? 'Cấu hình' : 'Configuration', table(vi ? ['Field', 'Bắt buộc', 'Mô tả'] : ['Field', 'Required', 'Description'], [['webhook_url', vi ? 'Có' : 'Yes', vi ? 'Endpoint HTTPS phía bạn để nhận sự kiện' : 'Your HTTPS endpoint that receives events'], ['token', vi ? 'Có' : 'Yes', vi ? 'Token bí mật gửi trong mỗi request' : 'Secret token sent with each request']]));
  body += section(vi ? 'Header nhận vào' : 'Incoming headers', table(['Header', vi ? 'Giá trị' : 'Value'], [['Content-Type', 'application/json'], ['Authorization', 'Bearer ${WEBHOOK_TOKEN}']]));
  body += section(vi ? 'Các field payload' : 'Payload fields', fieldTable(webhook.request, language));
  body += section(vi ? 'Ví dụ sự kiện' : 'Example event', code('json', webhook.requestExample));
  body += section(vi ? 'Tiếp nhận' : 'Receipt', vi ? '1. Kiểm tra `Authorization` có đúng token đã cấu hình.\n2. Lưu bền vững payload hoặc đưa vào hàng đợi.\n3. Trả HTTP **200** để xác nhận đã nhận.\n4. Xử lý trùng lặp và tự retry nghiệp vụ ở phía bạn. Xác nhận sau khi đã lưu để tránh mất sự kiện.' : '1. Verify `Authorization` against the configured token.\n2. Durably store the payload or enqueue it.\n3. Return HTTP **200** to acknowledge receipt.\n4. Deduplicate and own your business retries. Acknowledge only after durable receipt to avoid losing an event.');
  body += section(vi ? 'Sơ đồ webhook' : 'Webhook diagram', code('mermaid', vi ? 'sequenceDiagram\n  participant A as Orbit\n  participant W as Webhook của bạn\n  participant Q as Kho lưu bền vững\n  A->>W: POST sự kiện và bearer token\n  W->>W: Xác thực payload\n  W->>Q: Lưu bền vững\n  Q-->>W: Đã lưu\n  W-->>A: HTTP 200\n  Note over A,W: Sự kiện cũ có thể được gửi lại' : 'sequenceDiagram\n  participant A as Orbit\n  participant W as Your webhook\n  participant Q as Durable store\n  A->>W: POST event with bearer token\n  W->>W: Authenticate payload\n  W->>Q: Persist event\n  Q-->>W: Stored\n  W-->>A: HTTP 200\n  Note over A,W: Older events may be redelivered'));
  return body;
}

function errors(language) {
  const vi = language === 'vi';
  let body = section(vi ? 'Mã HTTP' : 'HTTP status codes', table(vi ? ['Mã', 'Ý nghĩa', 'Cách xử lý'] : ['Code', 'Meaning', 'Action'], [
    ['400', 'Bad Request', vi ? 'Kiểm tra body, tham số và kiểu dữ liệu.' : 'Check the body, parameters, and data types.'],
    ['401', 'Unauthorized', vi ? 'Token thiếu hoặc không hợp lệ; kiểm tra lại `Authorization`.' : 'Missing or invalid token; recheck `Authorization`.'],
    ['403', 'Forbidden', vi ? 'Token hợp lệ nhưng thiếu quyền cho tài nguyên này.' : 'Valid token without access to this resource.'],
    ['404', 'Not Found', vi ? 'Tài nguyên không tồn tại hoặc token không thấy nó.' : 'The resource does not exist or is not visible to this token.'],
    ['429', 'Too Many Requests', vi ? 'Chờ theo header `Retry-After` rồi thử lại.' : 'Wait for `Retry-After`, then retry.'],
    ['500', 'Internal Server Error', vi ? 'Thử lại với backoff lũy tiến và báo nếu lặp lại.' : 'Retry with exponential backoff and report repeated failures.'],
  ]));
  body += section(vi ? 'Giới hạn tần suất' : 'Rate limits', vi ? 'Phản hồi thành công có thể kèm header `X-RateLimit-Limit` và `X-RateLimit-Remaining`. Khi vượt giới hạn, API trả `429` kèm `Retry-After` (giây). Đây là ví dụ minh họa, không phải cam kết mức giới hạn cụ thể.' : 'Successful responses may include `X-RateLimit-Limit` and `X-RateLimit-Remaining`. When the limit is exceeded, the API returns `429` with `Retry-After` in seconds. These are illustrative, not a guarantee of a specific limit.');
  body += section(vi ? 'Phân trang' : 'Pagination', vi ? 'Dùng `limit` và `nextCursor`. Không tính `nextCursor` và không coi là mã ổn định. Dừng khi `nextCursor` là `null`.' : 'Use `limit` and `nextCursor`. Do not construct or persist cursors as stable identifiers. Stop when `nextCursor` is `null`.');
  body += section(vi ? 'Idempotency' : 'Idempotency', vi ? 'API mẫu không đảm bảo idempotency phía máy chủ. Sau timeout khi tạo dự án, đối chiếu bằng danh sách trước khi tạo lại để tránh trùng lặp.' : 'The sample API does not guarantee server-enforced idempotency. After a create timeout, reconcile with list before retrying to avoid duplicates.');
  return body;
}

function aiBody(language) {
  const vi = language === 'vi';
  return section(vi ? 'Bộ tài liệu theo sản phẩm và ngôn ngữ' : 'Product- and language-scoped context', vi ? 'Các tài nguyên dưới đây là route thật của cổng, sinh từ nội dung CMS đã công khai. `llms.txt` là chỉ mục ngắn; `llms-full.txt` là nội dung đầy đủ đã giải quyết fallback; `openapi.json` chứa schema inline và webhook OpenAPI 3.1; mỗi trang có bản `.md`. Chỉ dùng đúng sản phẩm/ngôn ngữ.' : 'These are real portal routes generated from published CMS content. `llms.txt` is a short index; `llms-full.txt` contains complete resolved documentation; `openapi.json` contains inline operation schemas and an OpenAPI 3.1 webhook; every page has a `.md` representation. Stay within the selected product and language.') + table(vi ? ['Tài nguyên', 'Đường dẫn'] : ['Resource', 'Path'], [['Index', `[llms.txt](/orbit/${language}/llms.txt)`], ['Full context', `[llms-full.txt](/orbit/${language}/llms-full.txt)`], ['OpenAPI', `[openapi.json](/orbit/${language}/openapi.json)`], ['Create a project', `[create-project.md](/orbit/${language}/create-project.md)`]]) + section(vi ? 'Claude, Codex và Cursor' : 'Claude, Codex, and Cursor', vi ? '1. **Claude:** đưa URL chỉ mục cho công cụ có khả năng tải web; nếu phiên làm việc không có quyền web, tải Markdown/OpenAPI rồi đính kèm file.\n2. **Codex:** yêu cầu đọc `llms.txt` trước, tải các `.md` liên quan và `openapi.json` bằng công cụ mạng được phép rồi đối chiếu code với schema.\n3. **Cursor:** thêm URL tài liệu vào nguồn Docs nếu được hỗ trợ, hoặc tải file vào vùng ngữ cảnh rồi tham chiếu trong chat.\n\nLuôn giữ token trong biến môi trường phía máy chủ và yêu cầu trợ lý hỏi lại trước khi gọi API. Không bao giờ dán bí mật vào prompt.' : '1. **Claude:** give the index URL to a tool that can fetch the web; if the session has no web access, download the Markdown and OpenAPI files and attach them.\n2. **Codex:** ask it to read `llms.txt` first, fetch the relevant `.md` files and `openapi.json` through an allowed network tool, then reconcile generated code against the schema.\n3. **Cursor:** add the documentation URL to a Docs source if supported, or load the files into an allowed context region and reference them in chat.\n\nKeep tokens in server-side environment variables and ask the assistant to confirm before calling the API. Never paste secrets into a prompt.');
}

export const documents = metadata.flatMap(([key, position, category, title, description]) => ['en', 'vi'].map(language => {
  const body = endpoints[key] ? apiBody(key, language) : key === 'overview' ? overview(language) : key === 'authentication' ? authentication(language) : key === 'webhooks' ? webhooksBody(language) : key === 'errors' ? errors(language) : aiBody(language);
  const endpoint = endpoints[key];
  const provenance = language === 'vi' ? '\n\n---\nTài liệu mẫu cho API Orbit giả lập, xuất bản bằng Docfolk. Xem [lỗi và giới hạn](errors).\n' : '\n\n---\nSample documentation for the fictional Orbit API, published with Docfolk. See [errors and limits](errors).\n';
  return { title: title[language], description: description[language], company: 'orbit', language, doc_key: key, category, position, body: body + provenance, ...(endpoint ? { method: endpoint.method, path: endpoint.path, operation: operationFor(endpoint, language, title[language], notes[key][language]) } : key === 'webhooks' ? { operation: operationFor(webhook, language, title[language], description[language], true) } : {}) };
}));
