// Illustrative OpenAPI contract for the fictional Orbit API used to demonstrate Docfolk.
// Descriptions are bilingual; schemas are sample content, not a live provider contract.
const d = (en, vi) => ({ description: en, 'x-description-vi': vi });
const s = (en, vi, extra = {}) => ({ type: 'string', ...d(en, vi), ...extra });
const n = (en, vi, extra = {}) => ({ type: 'number', ...d(en, vi), ...extra });
const o = (properties, en, vi, required = []) => ({ type: 'object', ...d(en, vi), properties, ...(required.length ? { required } : {}) });
const a = (items, en, vi, extra = {}) => ({ type: 'array', ...d(en, vi), items, ...extra });

const id = s('Unique project identifier.', 'Mã dự án duy nhất.');
const project = o({
  id,
  name: s('Human-readable project name.', 'Tên dự án hiển thị.'),
  region: s('Deployment region.', 'Vùng triển khai.', { enum: ['us', 'eu', 'ap'] }),
  status: s('Lifecycle status.', 'Trạng thái vòng đời.', { enum: ['active', 'archived'] }),
  createdAt: s('Creation time, ISO 8601.', 'Thời điểm tạo, ISO 8601.', { format: 'date-time' }),
}, 'A project resource.', 'Tài nguyên dự án.', ['id', 'name', 'region', 'status', 'createdAt']);

const projectList = o({
  items: a(project, 'Projects on this page.', 'Dự án trong trang này.'),
  nextCursor: { ...s('Opaque cursor for the next page, or null at the end.', 'Con trỏ mờ cho trang kế tiếp, hoặc null khi hết.'), type: ['string', 'null'] },
}, 'A paginated project collection.', 'Danh sách dự án phân trang.', ['items']);

const p = (name, where, schema, required = false) => ({ name, in: where, required: where === 'path' || required, schema, description: schema.description, 'x-description-vi': schema['x-description-vi'] });
const projectExample = { id: 'prj_01HZX', name: 'My first project', region: 'us', status: 'active', createdAt: '2026-01-01T00:00:00Z' };

export const endpoints = {
  'list-projects': {
    method: 'GET', path: '/projects', operationId: 'listProjects',
    parameters: [
      p('limit', 'query', { ...n('Page size, 1–100. Defaults to 20.', 'Số bản ghi mỗi trang, 1–100. Mặc định 20.'), type: 'integer', default: 20 }),
      p('cursor', 'query', s('Cursor from a previous response’s nextCursor.', 'Con trỏ từ nextCursor của phản hồi trước.')),
      p('status', 'query', s('Filter by lifecycle status.', 'Lọc theo trạng thái vòng đời.', { enum: ['active', 'archived'] })),
    ],
    response: projectList, responseExample: { items: [projectExample], nextCursor: null }, examplePath: '/projects?limit=20',
  },
  'create-project': {
    method: 'POST', path: '/projects', operationId: 'createProject',
    request: o({
      name: s('Project name, 1–80 characters.', 'Tên dự án, 1–80 ký tự.'),
      region: s('Deployment region. Defaults to us.', 'Vùng triển khai. Mặc định us.', { enum: ['us', 'eu', 'ap'], default: 'us' }),
    }, 'Fields accepted when creating a project.', 'Các field khi tạo dự án.', ['name']),
    requestExample: { name: 'My first project', region: 'us' },
    response: project, responseExample: projectExample,
  },
  'get-project': {
    method: 'GET', path: '/projects/{projectId}', operationId: 'getProject',
    parameters: [p('projectId', 'path', s('Project identifier returned by create-project.', 'Mã dự án trả về khi tạo dự án.'))],
    response: project, responseExample: projectExample, examplePath: '/projects/prj_01HZX',
  },
};

export const webhook = {
  operationId: 'receiveProjectEvent',
  request: o({
    id,
    name: s('Project name at event time.', 'Tên dự án tại thời điểm sự kiện.'),
    event: s('Event type.', 'Loại sự kiện.', { enum: ['project.created', 'project.updated', 'project.archived'] }),
    status: s('Project status after the event.', 'Trạng thái dự án sau sự kiện.', { enum: ['active', 'archived'] }),
    updatedAt: s('Event time, ISO 8601.', 'Thời điểm sự kiện, ISO 8601.', { format: 'date-time' }),
  }, 'Event delivered to your webhook endpoint.', 'Sự kiện gửi tới endpoint webhook của bạn.', ['id', 'event', 'status', 'updatedAt']),
  requestExample: { id: 'prj_01HZX', name: 'My first project', event: 'project.updated', status: 'active', updatedAt: '2026-01-01T00:00:00Z' },
};

export function localize(value, language) {
  if (Array.isArray(value)) return value.map(item => localize(item, language));
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'x-description-vi').map(([key, item]) => [key, key === 'description' && language === 'vi' && value['x-description-vi'] ? value['x-description-vi'] : localize(item, language)]));
}

export function operationFor(endpoint, language, title, description, isWebhook = false) {
  const headers = isWebhook
    ? [p('Authorization', 'header', s('Bearer ${WEBHOOK_TOKEN}; token configured for your webhook endpoint.', 'Bearer ${WEBHOOK_TOKEN}; token đã cấu hình cho endpoint webhook của bạn.'), true)]
    : [
      p('Authorization', 'header', s('Bearer ${API_TOKEN}; token for the selected environment.', 'Bearer ${API_TOKEN}; token của môi trường đã chọn.'), true),
      p('Accept-Language', 'header', s('Preferred response language: en, vi, km, lo, my.', 'Ngôn ngữ phản hồi mong muốn: en, vi, km, lo, my.', { enum: ['en', 'vi', 'km', 'lo', 'my'] })),
    ];
  const media = endpoint.media || 'application/json';
  const responses = isWebhook
    ? {
      '200': { description: language === 'vi' ? 'Đã nhận. Không có body phản hồi được quy định.' : 'Received. No response body is specified.' },
      default: { description: language === 'vi' ? 'Phản hồi khác 200 hoặc timeout có thể khiến sự kiện được gửi lại.' : 'A non-200 response or timeout may cause the event to be redelivered.' },
    }
    : {
      '200': { description: language === 'vi' ? 'Phản hồi thành công minh họa.' : 'Illustrative successful response.', content: { [media]: { schema: endpoint.response, example: endpoint.responseExample } } },
      '400': { description: 'Bad Request. Malformed body or invalid query parameters.' },
      '401': { description: 'Unauthorized. Missing or invalid bearer token.' },
      '403': { description: 'Forbidden. The token lacks access to this resource.' },
      '404': { description: 'Not Found. The resource does not exist or is not visible to this token.' },
      '429': { description: 'Too Many Requests. Retry after the interval in Retry-After.' },
      '500': { description: 'Internal Server Error. Retry with backoff and report repeated failures.' },
    };
  const operation = {
    operationId: endpoint.operationId, summary: title, description, tags: [isWebhook ? 'Webhooks' : 'Projects'],
    parameters: [...headers, ...(endpoint.parameters || [])],
    ...(endpoint.request ? { requestBody: { required: true, content: { 'application/json': { schema: endpoint.request, example: endpoint.requestExample } } } } : {}),
    responses,
    ...(isWebhook ? { 'x-webhook-name': 'projectUpdated' } : {}),
  };
  return localize(operation, language);
}

export function schemaRows(schema, language, prefix = '', parentRequired = true) {
  const translated = localize(schema, language);
  const rows = [];
  for (const [key, field] of Object.entries(translated.properties || {})) {
    const path = prefix ? `${prefix}.${key}` : key;
    const required = translated.required?.includes(key) ? (parentRequired ? (language === 'vi' ? 'Có' : 'Yes') : (language === 'vi' ? 'Khi có object cha' : 'When parent is present')) : (language === 'vi' ? 'Xem mô tả' : 'See description');
    const constraints = [
      field.enum ? `${language === 'vi' ? 'Giá trị' : 'Values'}: ${field.enum.map(value => `\`${value}\``).join(', ')}.` : '',
      field.default !== undefined ? `${language === 'vi' ? 'Mặc định' : 'Default'}: \`${field.default}\`.` : '',
    ].filter(Boolean).join(' ');
    rows.push([`\`${path}\``, Array.isArray(field.type) ? field.type.join(' / ') : field.type || 'unspecified', required, [field.description, constraints].filter(Boolean).join(' ')]);
    if (field.properties) rows.push(...schemaRows(field, language, path, Boolean(translated.required?.includes(key))));
    if (field.items?.properties) rows.push(...schemaRows(field.items, language, `${path}[]`, false));
  }
  if (translated.type === 'array' && translated.items?.properties) rows.push(...schemaRows(translated.items, language, prefix ? `${prefix}[]` : '[]', false));
  return rows;
}
