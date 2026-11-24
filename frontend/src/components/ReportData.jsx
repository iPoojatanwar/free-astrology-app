
const formatLabel = (key) => {
  return String(key)
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Not available';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'string') {
    return value
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/?[^>]+(>|$)/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .trim();
  }

  return String(value);
};

const isPrimitive = (value) =>
  value === null ||
  value === undefined ||
  typeof value !== 'object';

const ReportData = ({ data, title = 'Report Details' }) => {
  if (data === null || data === undefined) return null;

  if (isPrimitive(data)) {
    return (
      <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
        <p className="text-sm text-gray-700 break-words">
          {formatValue(data)}
        </p>
      </div>
    );
  }

  if (Array.isArray(data)) {
    if (!data.length) return null;

    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-purple-100 bg-white p-4"
          >
            {typeof item === 'object' && item !== null ? (
              <ReportData data={item} title={`Item ${index + 1}`} />
            ) : (
              <p className="text-sm text-gray-700 break-words">
                {formatValue(item)}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  const entries = Object.entries(data).filter(
    ([, value]) => value !== undefined && value !== null
  );

  if (!entries.length) return null;

  const simpleEntries = entries.filter(([, value]) => isPrimitive(value));
  const complexEntries = entries.filter(([, value]) => !isPrimitive(value));

  return (
    <section className="space-y-4">
      {title && (
        <h3 className="text-lg font-bold text-purple-900">
          {title}
        </h3>
      )}

      {simpleEntries.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {simpleEntries.map(([key, value]) => (
            <div
              key={key}
              className="rounded-xl border border-purple-100 bg-purple-50/70 p-4"
            >
              <p className="text-xs font-medium text-gray-500 mb-1">
                {formatLabel(key)}
              </p>
              <p className="text-sm font-semibold text-gray-800 break-words whitespace-pre-wrap">
                {formatValue(value) || 'Not available'}
              </p>
            </div>
          ))}
        </div>
      )}

      {complexEntries.map(([key, value]) => (
        <div
          key={key}
          className="rounded-2xl border border-purple-100 bg-white p-4 sm:p-5 space-y-3"
        >
          <h4 className="font-semibold text-purple-800">
            {formatLabel(key)}
          </h4>

          <ReportData data={value} title="" />
        </div>
      ))}
    </section>
  );
};

export default ReportData;
