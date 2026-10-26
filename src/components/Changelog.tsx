import { changelog } from "@/datasheets/changelog";

export const Changelog = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="changelog">
      <h2 className="unifrakturcook-bold step-title">Changelog</h2>
      <div className="changelog__list">
        {changelog.map((entry) => (
          <div key={entry.version} className="changelog__entry">
            <h3 className="changelog__version unifrakturcook-bold">
              v{entry.version}
            </h3>
            <ul>
              {entry.changes.map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="btn-group">
        <button
          className="btn btn--cta unifrakturcook-bold"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </div>
  );
};
