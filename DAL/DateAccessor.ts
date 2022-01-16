module DateAccessor {
    export function Today ()
    {
        return new Date();
    }

    export function Yesterday ()
    {
        return ( d => new Date(d.setDate(d.getDate()-1)) )(new Date);
    }

    export function GetDateXDaysFromNow(intervalDays:number)
    {
        return ( d => new Date(d.setDate(d.getDate()+intervalDays)) )(new Date);
    }
}