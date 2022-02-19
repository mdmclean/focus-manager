export class RecurringAction {
    id: string;
    targetTheme: string;
    frequencyInDays: number; 
    nextOccurrence: Date;
    name: string;
    description: string; 
    priority: number; 
    childOf: string; 
    rowZeroIndexed: number;
    points: number;

    constructor(id: string,
        targetTheme: string,
        frequencyInDays: number,
        nextOccurrence: Date,
        name: string,
        description: string,
        priority: number,
        childOf: string,
        rowZeroIndexed: number,
        points: number
    ) {
        this.id = id; 
        this.targetTheme = targetTheme;
        this.frequencyInDays = frequencyInDays;
        this.nextOccurrence = nextOccurrence;
        this.name = name;
        this.description = description; 
        this.priority = priority; 
        this.childOf = childOf; 
        this.rowZeroIndexed = rowZeroIndexed; 
        this.points = points;
    }
}