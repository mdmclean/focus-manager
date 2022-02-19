import { expect } from "chai";
import { it, describe } from "mocha";
import { Graphs } from "../WeeklySummary";
import { NextAction } from "../Models/Sheets/NextAction";
import { Updater } from "../DailyUpdater"

function CreateMockNextAction(id:number, year:number, month:number, day:number)
{
  let actionDate:Date = new Date(`${year}-${month}-${day}`)
  return new NextAction(`test-${id}`, `test-${id} name`, `test-${id} description`, id, 
      `parent-${id}`, true, actionDate, `theme-${id}`, id, id, actionDate, true, id, id,`link-${id}`, id,actionDate, actionDate, actionDate, 1, 1, "","")
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
  });
});

describe("DailyUpdate", () => {
  describe("CheckBlockingRelationships", () => {
    it("Should leave the list unchanged if there are no blocking relationships", () => {
      let testNextActionSet: NextAction[] = [];
      testNextActionSet.push(CreateMockNextAction(1, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(2, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(3, 2022, 2, 1));
      let updatedActions = Updater.CheckBlockingRelationships(testNextActionSet);
      expect(updatedActions).to.equal(testNextActionSet);
    });
    it("Should remove the blocking item if it's done", () => {
      let testNextActionSet: NextAction[] = [];
      testNextActionSet.push(CreateMockNextAction(1, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(2, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(3, 2022, 2, 1));

      testNextActionSet[0].blockedBy = testNextActionSet[1].id;
      testNextActionSet[1].isDone = true;

      let updatedActions = Updater.CheckBlockingRelationships(testNextActionSet);
      expect(updatedActions[0].blockedBy).to.equal("");
    });
    it("Should not remove the blocking item if it's not done", () => {
      let testNextActionSet: NextAction[] = [];
      testNextActionSet.push(CreateMockNextAction(1, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(2, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(3, 2022, 2, 1));

      testNextActionSet[0].blockedBy = testNextActionSet[1].id;
      testNextActionSet[1].isDone = false;

      let updatedActions = Updater.CheckBlockingRelationships(testNextActionSet);
      expect(updatedActions[0].blockedBy).to.equal(testNextActionSet[1].id);
    });
  });
  describe("AddBlockedByFromBlocks", () => {
    it("Should leave the list unchanged if there are no blocking relationships", () => {
      let testNextActionSet: NextAction[] = [];
      testNextActionSet.push(CreateMockNextAction(1, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(2, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(3, 2022, 2, 1));
      let updatedActions = Updater.AddBlockedByFromBlocks(testNextActionSet);
      expect(updatedActions).to.equal(testNextActionSet);
    });
    it("Should add a blockedBy to the blocked ticket if the blocking ticket is still open", () => {
      let testNextActionSet: NextAction[] = [];
      testNextActionSet.push(CreateMockNextAction(1, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(2, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(3, 2022, 2, 1));

      testNextActionSet[0].blocks = testNextActionSet[1].id;
      testNextActionSet[0].isDone = false;

      let updatedActions = Updater.AddBlockedByFromBlocks(testNextActionSet);
      expect(updatedActions[1].blockedBy).to.equal(testNextActionSet[0].id);
    });
    it("Should NOT add a blockedBy to the blocked ticket if the blocking ticket is closed", () => {
      let testNextActionSet: NextAction[] = [];
      testNextActionSet.push(CreateMockNextAction(1, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(2, 2022, 1, 1));
      testNextActionSet.push(CreateMockNextAction(3, 2022, 2, 1));

      testNextActionSet[0].blocks = testNextActionSet[1].id;
      testNextActionSet[0].isDone = true;

      let updatedActions = Updater.AddBlockedByFromBlocks(testNextActionSet);
      expect(updatedActions[1].blockedBy).to.equal("");
    });
  });
});

