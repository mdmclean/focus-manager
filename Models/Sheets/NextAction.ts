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
        displayOrder: number
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
    }
}