import { expect } from "chai";
import { it, describe } from "mocha";
import { Graphs } from "../WeeklySummary";
import { NextAction } from "../Models/Sheets/NextAction";

function CreateMockNextAction(id:number, year:number, month:number, day:number)
{
  let actionDate:Date = new Date(`${year}-${month}-${day}`)
  return new NextAction(`test-${id}`, `test-${id} name`, `test-${id} description`, id, 
      `parent-${id}`, true, actionDate, `theme-${id}`, id, id, actionDate, true, id, id,`link-${id}`, id, null, actionDate)
}

describe("Graphs", () => {
  describe("GetTotalPointsByWeek()", () => {
    it("Should take actions in 2 different weeks and return 2 summaries", () => {
      let testNextActionSet: NextAction[] = [];
      testNextActionSet.push(CreateMockNextAction(1, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(2, 2022, 2, 1));
      let result = Graphs.GetTotalPointsByWeek(testNextActionSet);
      expect(result.length).to.equal(2);
    });
    it("Should take 2 actions in one week and another action in a different week and return 2 entries", () => {
      let testNextActionSet: NextAction[] = [];
      testNextActionSet.push(CreateMockNextAction(1, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(2, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(3, 2022, 2, 1));
      let result = Graphs.GetTotalPointsByWeek(testNextActionSet);
      expect(result.length).to.equal(2);
    });
    it("temp", () => {
      let testNextActionSet: NextAction[] = [];
      testNextActionSet.push(CreateMockNextAction(1, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(2, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(3, 2022, 2, 1));
      testNextActionSet.push(CreateMockNextAction(4, 2022, 2, 1));
      let weeks = Graphs.GetTotalPointsByWeek(testNextActionSet);
      let chart = Graphs.GetWeeklyVelocityChart(weeks);
      console.log(chart);
      expect(weeks.length).to.equal(2);
    });
  });
});
