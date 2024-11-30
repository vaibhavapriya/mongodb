/* Find all the topics and tasks which are taught in the month of October */
db.topics.aggregate([
  {
    $lookup: {
      from: "tasks",
      localField: "_id",
      foreignField: "topic_id",
      as: "related_tasks"
    }
  },
  {
    $match: {
      date: {
        $gte: ISODate("2020-10-01"),
        $lte: ISODate("2020-10-31")
      }
    }
  },
  {
    $project: {
      topic: 1,
      date: 1,
      related_tasks: 1
    }
  }
]);

/* Find all the company drives which appeared between 15 Oct 2020 and 31 Oct 2020 */
db.company_drives.find({
  date: {
    $gte: ISODate("2020-10-15"),
    $lte: ISODate("2020-10-31")
  }
});

/* Find all the company drives and students who appeared for the placement */
db.company_drives.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "users_appeared",
      foreignField: "_id",
      as: "students"
    }
  },
  {
    $project: {
      company_name: 1,
      date: 1,
      students: { name: 1, email: 1 }
    }
  }
]);

/* Find the number of problems solved by the user in codekata */
db.codekata.aggregate([
  {
    $group: {
      _id: "$user_id",
      total_problems_solved: { $sum: "$problems_solved" }
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $project: {
      "user.name": 1,
      total_problems_solved: 1
    }
  }
]);

/* Find all the mentors with mentee counts more than 15 */
db.mentors.find({
  mentees_count: { $gt: 15 }
});

/* Find the number of users who are absent and tasks not submitted between 15 Oct 2020 and 31 Oct 2020
javascript */

db.attendance.aggregate([
  {
    $match: {
      date: {
        $gte: ISODate("2020-10-15"),
        $lte: ISODate("2020-10-31")
      },
      status: "absent"
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
    $project: {
      user_id: 1,
      date: 1,
      tasks_not_submitted: {
        $filter: {
          input: "$tasks",
          as: "task",
          cond: { $eq: ["$$task.submitted", false] }
        }
      }
    }
  },
  {
    $match: {
      "tasks_not_submitted.0": { $exists: true }
    }
  }
]);

