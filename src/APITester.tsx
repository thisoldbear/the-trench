import { useRef, type FormEvent } from "react";

export function APITester() {
  const responseInputRef = useRef<HTMLTextAreaElement>(null);

  const testEndpoint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const endpoint = formData.get("endpoint") ?? "";
      const method = formData.get("method") ?? "GET";

      // Validate endpoint is a relative path
      if (typeof endpoint !== "string" || !endpoint.startsWith("/") || /^[a-z][a-z0-9+.-]*:/i.test(endpoint)) {
        throw new Error("Invalid endpoint: must be a relative path starting with /");
      }

      // Validate method is whitelisted
      const allowedMethods = ["GET", "PUT"];
      if (typeof method !== "string" || !allowedMethods.includes(method)) {
        throw new Error("Invalid method: must be GET or PUT");
      }

      const url = new URL(endpoint, location.href);
      const res = await fetch(url, { method });

      const data = await res.json();
      responseInputRef.current!.value = JSON.stringify(data, null, 2);
    } catch (error) {
      responseInputRef.current!.value = String(error);
    }
  };

  return (
    <div className="api-tester">
      <form onSubmit={testEndpoint} className="endpoint-row">
        <select name="method" className="method">
          <option value="GET">GET</option>
          <option value="PUT">PUT</option>
        </select>
        <input type="text" name="endpoint" defaultValue="/api/hello" className="url-input" placeholder="/api/hello" />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
      <textarea ref={responseInputRef} readOnly placeholder="Response will appear here..." className="response-area" />
    </div>
  );
}
