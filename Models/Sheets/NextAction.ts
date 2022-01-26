class NextAction {
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
        snoozeUntil: Date
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
        this.orderingWeightingScore = PrioritizationWeighting(snoozeUntil, lastUpdated, displayOrder, priority, targetDate);
    }
}

function PrioritizationWeighting(snoozeUntil:Date, lastUpdated:Date, displayOrder:number, priority:number, targetDate:Date) : number
{
  let daysSinceUpdated:number = DateHelper.DaysBetween(DateAccessor.Today(), lastUpdated);

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

  return daysSinceUpdated + displayOrder + priority + daysUntilDoneSnoozing*20 - daysPastTargetDate;
}

