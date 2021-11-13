import History from "./../src/history.js";

describe("history tests", () => {
  let history = null;
  let testMethod = null;
  ["getSuggestion", "naiveGetSuggestion"].forEach((fn) => {
    describe(`autosuggestion test for: ${fn}`, () => {
      beforeEach(() => {
        history = new History();
        testMethod = history[fn].bind(history);
      });

      test("simple suggestion 1", () => {
        history.pushItem("hue lights");
        expect(testMethod("h")).toBe("hue lights");
      });

      test("simple suggestion 2", () => {
        history.pushItem("hue lights");
        history.pushItem("ipinfo 121212");
        expect(testMethod("hue")).toBe("hue lights");
        expect(testMethod("ip")).toBe("ipinfo 121212");
      });

      test("get latest suggestion", () => {
        history.pushItem("hue lights");
        history.pushItem("hue");
        expect(testMethod("h")).toBe("hue");
      });

      test("empty search", () => {
        expect(testMethod("")).toBe("");
      });

      test("not found 1", () => {
        history.pushItem("hue");
        expect(testMethod("huee")).toBe("");
      });

      test("not found 2", () => {
        history.pushItem("a");
        expect(testMethod("b")).toBe("");
      });
    });
  });
});
