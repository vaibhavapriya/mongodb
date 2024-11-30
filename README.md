# mongodb

This project involves designing and querying a MongoDB database for a Zen class program. The database includes collections for **users**, **attendance**, **tasks**, **topics**, **company_drives**, and **mentors**. Below is a summary of the tasks performed and queries used.

---

## Collections
### 1. **Attendance**
Tracks user attendance with fields:
- `user_id`: ID of the user.
- `date`: Attendance date (ISODate format).
- `attendance`: Status (`"Present"` or `"Absent"`).

### 2. **Tasks**
Tracks tasks assigned to users:
- `topic_id`: ID of the related topic.
- `title`: Task title.
- `due_date`: Task due date.
- `status`: Task completion status (`"Pending"` or `"Completed"`).

---

## Tasks Performed
### Query Objectives
1. Find all topics and tasks taught in October.
2. Retrieve company drives conducted between **15-Oct-2020** and **31-Oct-2020**.
3. List company drives along with students who appeared for placements.
4. Count the number of problems solved by users in `codekata`.
5. Retrieve mentors with a mentee count greater than 15.
6. Identify users who were absent and didn’t submit tasks between **15-Oct-2020** and **31-Oct-2020**.

---

## Key Query Example: Attendance and Tasks Analysis

```javascript
db.attendance.aggregate([
  {
    $match: {
      date: {
        $gte: ISODate("2020-10-15T00:00:00Z"),
        $lte: ISODate("2020-10-31T00:00:00Z")
      },
      attendance: "Absent"
    }
  },
  {
    $lookup: {
      from: "tasks",
      localField: "user_id",
      foreignField: "user_id",
      as: "tasks"
    }
  },
  {
    $unwind: "$tasks"
  },
  {
    $match: {
      "tasks.status": "Pending"
    }
  },
  {
    $project: {
      user_id: 1,
      date: 1,
      "tasks.title": 1,
      "tasks.status": 1
    }
  }
]);
```

---

## Results
- **Topics and Tasks for October**: Retrieved based on the `date` field.
- **Company Drives in Date Range**: Filtered using `$gte` and `$lte`.
- **Absent Users with Pending Tasks**: Identified using `$lookup`, `$unwind`, and `$match`.
