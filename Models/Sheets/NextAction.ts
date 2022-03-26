import { DateAccessor } from "../../DAL/DateAccessor";
import { DateHelper } from "../../Helpers/DateHelper";

export class NextAction {
    id: string;
    name: string;
    description: string; 
    priority: number; 
    childOf: string; 
    isDone: boolean; 
    lastUpdated: Date; 
    theme: string; 
    points: number; 
    effortCount: number; 
    targetDate: Date; 
    isDiplayed: boolean;
    originalPriority: number; 
    rowZeroIndexed: number;
    link:string;
    displayOrder: number;
    snoozeUntil: Date;
    orderingWeightingScore: number;
    resolutionDate: Date;
    createdDate: Date;
    urgency: number; 
    importance: number;
    blockedBy: string; 
    blocks: string;
    updated: boolean;

    constructor(id: string,
        name: string,
        description: string,
        priority: number,
        childOf: string,
        isDone: boolean, 
        lastUpdated: Date, 
        theme: string, 
        points: number, 
        effortCount: number, 
        targetDate: Date,
        isDiplayed: boolean,
        originalPriority: number,
        rowZeroIndexed: number,
        link:string, 
        displayOrder: number,
        snoozeUntil: Date,
        resolutionDate: Date,
        createdDate: Date,
        urgency: number,
        importance: number,
        blockedBy: string,
        blocks: string
    ) {
        this.id = id; 
        this.name = name;
        this.description = description; 
        this.priority = priority; 
        this.childOf = childOf; 
        this.isDone = isDone;
        this.lastUpdated = lastUpdated; 
        this.theme = theme; 
        this.points = points; 
        this.effortCount = effortCount; 
        this.targetDate = targetDate; 
        this.isDiplayed = isDiplayed; 
        this.originalPriority = originalPriority; 
        this.rowZeroIndexed = rowZeroIndexed; 
        this.link = link;
        this.displayOrder = displayOrder;
        this.snoozeUntil = snoozeUntil;
        this.orderingWeightingScore = PrioritizationWeighting(snoozeUntil, lastUpdated, displayOrder, priority, targetDate, urgency, importance, blockedBy, points);
        this.resolutionDate = resolutionDate;
        this.createdDate = createdDate;
        this.urgency = urgency;
        this.importance = importance;
        this.blockedBy = blockedBy;
        this.blocks = blocks;
        this.updated = false;
    }
}

function PrioritizationWeighting(snoozeUntil:Date, lastUpdated:Date, displayOrder:number, priority:number, targetDate:Date, urgency:number, importance:number, blockedBy:string, points:number) : number
{
  let daysSinceUpdated:number = 0;
  if (DateHelper.IsDateValid(snoozeUntil) && snoozeUntil > DateAccessor.Today())
  {
    daysSinceUpdated = DateHelper.DaysBetween(DateAccessor.Today(), lastUpdated);
  }

  let daysUntilDoneSnoozing:number = 0;
  if (DateHelper.IsDateValid(snoozeUntil) && snoozeUntil > DateAccessor.Today())
  {
    daysUntilDoneSnoozing = DateHelper.DaysBetween(DateAccessor.Today(), snoozeUntil);
  }

  let daysPastTargetDate:number = 0;
  if (DateHelper.IsDateValid(targetDate) && targetDate < DateAccessor.Today())
  {
      daysPastTargetDate = DateHelper.DaysBetween(DateAccessor.Today(), targetDate);
  }

  let sanitizedUrgency = urgency === undefined || urgency === null || urgency < 1 ? 1 : urgency;

  let sanitizedImportance = importance === undefined || importance === null || importance < 1 ? 1 : importance;

  let isBlockedBump:number = blockedBy !== "" && blockedBy !== undefined ? 1000 : 0;

  let zeroPointReminderBump = points === 0 ? 100 : 0;

  return daysSinceUpdated + displayOrder + priority + daysUntilDoneSnoozing*1000 - daysPastTargetDate - sanitizedUrgency*10 - sanitizedImportance*5 + isBlockedBump - zeroPointReminderBump;
}

