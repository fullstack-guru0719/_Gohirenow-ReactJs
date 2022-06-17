export const salaryTypes=[
    {
        id: 1,
        name: "Hourly"
    },
    {
        id: 2,
        name: "Weekly"
    },
    {
        id: 3,
        name: "Monthly"
    },
    {
        id: 4,
        name: "Fixed"
    }
]

export const ShortSalaryTypeById = (id) => id ? ["", "Hour", "Week", "Month", "Fixed"][id] : "Fixed";


export const availability=[
    {
        id: 1,
        name: ""
    },
    {
        id: 2,
        name: "Full-Time"
    },
    {
        id: 3,
        name: "Part-Time"
    },

]