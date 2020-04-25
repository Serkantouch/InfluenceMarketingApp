const express = require('express');
const router = express.Router();
const passport = require('passport');
var ObjectID = require('mongodb').ObjectID
const taskStatus = require('../../utils/Constants').TaskStatus;
const userRoles = require("../../utils/Constants").UserRoles;
let fetchUserDetails = require("../../utils/UserDetails")
// Bring in passport strategy
require('../../config/passport')(passport)

// Task Model
const Task = require('../../models/Task');
const SponsorProfile = require('../../models/SponsorProfile');
const InfluencerProfile = require('../../models/InfluencerProfile');
const Rating = require('../../models/Rating');

// @route   POST api/task/create
// @desc    Create a task
// @access  Public
router.post('/create', (req, res) => {
    console.log('Inside Task Post Request');
    Task.create({
        title: req.body.title,
        postedBy: req.body.postedBy,
        description: req.body.description,
        image: req.body.image,
        salary: req.body.salary,
        category: req.body.category,
        vacancyCount: req.body.vacancyCount,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        status: taskStatus.CREATED
    }, (err1, result1) => {
        if (err1) {
            console.log(err1);
            res.status(400).json({success: false, message: err1});
        }
        SponsorProfile.findOneAndUpdate({
            email: req.body.postedBy
        }, {
            $push: {
                tasksPosted: result1._id
            }
        }, {returnOriginal: false, useFindAndModify: false})
            .then(result => {
                console.log("Task created successfully")
                res.status(200).json({success: false, message: "Task created successfully"});
            })
            .catch((err) => {
                //TODO: delete the task
                Task.findOneAndDelete({_id: ObjectID(result1._id)});
                console.log(err);
                res.status(400).json({success: false, message: err})
            })
    });
});

// @route   GET api/task
// @desc    Get all "CREATED" tasks
// @access  Public
router.get('/', (req, res) => {
    console.log('Inside Task Get Request for "CREATED" tasks');
    Task.find({status: taskStatus.CREATED}).sort({postedOn: -1}).then((tasks) => {
        console.log("Successfully fetched all created tasks")
        res.status(200).json({success: true, message: tasks})
    })
        .catch((err) => {
            console.log(err);
            res.status(400).json({success: false, message: err})
        })
});

// @route   GET api/task/:taskId/applicants
// @desc    Get all applicants who applied for a given task
// @access  Public
router.get('/:taskId/applicants', (req, res) => {
    console.log('Inside Task Get applicants  Request');
    Task.findOne({_id: ObjectID(req.params.taskId)})
        .then((task) => {
            // check if task exists
            if (task) {
                if (task.appliedCandidates.length > 0) {
                    InfluencerProfile.find({_id: {$in: task.appliedCandidates}}).then((candidates) => {
                        console.log("Successfully fetched all candidates who applied for this task")
                        res.status(200).json({success: true, message: candidates})
                    }).catch(err => {
                        console.log(err);
                        res.status(400).json({success: false, message: "Unable to fetch candidates!"})
                    })
                } else {
                    console.log("No candidates have applied for this task")
                    res.status(400).json({success: false, message: "No candidates have applied for this task"})
                }
            } else {
                console.log("Task does not exist")
                res.status(404).json({success: false, message: "Task does not exist"})
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({success: false, message: err})
        })
});

// @route   PUT api/task/edit/:taskId
// @desc    Edit a task for given task id
// @access  Public
router.put("/edit/:taskId", (req, res) => {
    console.log("Inside Edit Task request for Task ID:", req.params.taskId);
    Task.findOneAndUpdate(
        {_id: ObjectID(req.params.taskId)},
        {
            $set: {
                title: req.body.title,
                postedBy: req.body.postedBy,
                postedOn: req.body.postedOn,
                description: req.body.description,
                images: req.body.images,
                status: req.body.status,
                salary: req.body.salary,
                category: req.body.category,
                appliedCandidates: req.body.appliedCandidates,
                selectedCandidates: req.body.selectedCandidates,
                vacancyCount: req.body.vacancyCount,
                startDate: req.body.startDate,
                endDate: req.body.endDate
            }
        },
        {returnOriginal: false, useFindAndModify: false}
    )
        .then(task => {
            console.log("Task modified successfully")
            res.status(200).json({message: "Task modified successfully"})
        })
        .catch(err => {
            console.log("Task could not be modified")
            res.status(400).json({message: "Task could not be modified"})
        })
});

// @route   GET api/tasks?email&&status
// @desc    Fetch all tasks by current sponsor by email and filter using task status
// @access  Public
router.get("/filter", (req, res) => {
    console.log("Inside Get tasks by current sponsor with filter by status")
    User.findOne({email: req.query.email})
        .then(user => {
            // check if user exists
            if (user) {
                if (user.role == userRoles.INFLUENCER) {
                    if (req.query.status === taskStatus.ALL) {
                        Task.find({appliedCandidates: {$elemMatch: {$eq: req.query.email}}})
                            .then(tasks => {
                                if (tasks) {
                                    console.log("Tasks fetched successsfully")
                                    res.status(200).json({message: tasks})
                                } else {
                                    console.log("No Tasks Found")
                                    res.status(404).json({message: "No Tasks Found"})
                                }
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(400).json({message: err})
                            })
                    } else if (req.query.status === taskStatus.APPLIED) {
                        Task.find({
                            $and: [{appliedCandidates: {$elemMatch: {$eq: req.query.email}}}, {
                                $nor: [{
                                    selectedCandidates: {
                                        $elemMatch: {$eq: req.query.email}
                                    }
                                }
                                ]
                            }],

                        })
                            .then(tasks => {
                                if (tasks) {
                                    console.log("Tasks fetched successsfully")
                                    res.status(200).json({message: tasks})
                                } else {
                                    console.log("No Tasks Found")
                                    res.status(404).json({message: "No Tasks Found"})
                                }
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(400).json({message: err})
                            })
                    } else {
                        Task.find({selectedCandidates: {$elemMatch: {$eq: req.query.email}}, status: req.query.status})
                            .then(tasks => {
                                if (tasks) {
                                    console.log("Tasks fetched successsfully")
                                    res.status(200).json({message: tasks})
                                } else {
                                    console.log("No Tasks Found")
                                    res.status(404).json({message: "No Tasks Found"})
                                }
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(400).json({message: err})
                            })
                    }
                } else {
                    // user is sponsor
                    if (req.query.status == "All") {
                        Task.find({postedBy: req.query.email})
                            .then(tasks => {
                                if (tasks) {
                                    console.log("Tasks fetched successsfully")
                                    res.status(200).json({message: tasks})
                                } else {
                                    console.log("No Tasks Found")
                                    res.status(404).json({message: "No Tasks Found"})
                                }
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(400).json({message: err})
                            })
                    } else {
                        Task.find({postedBy: req.query.email, status: req.query.status})
                            .then(tasks => {
                                if (tasks) {
                                    console.log("Tasks fetched successsfully")
                                    res.status(200).json({message: tasks})
                                } else {
                                    console.log("No Tasks Found")
                                    res.status(404).json({message: "No Tasks Found"})
                                }
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(400).json({message: err})
                            })
                    }
                }
            } else {
                console.log("User does not exist")
                res.status(404).json({message: "User does not exist"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({message: err})
        });
});

// @route   PUT api/tasks/:taskId/select 
// @desc    Select a candidate for a task by sponsor
// @access  Public
router.put("/:taskId/select", (req, res) => {
    console.log("Inside select candidate request")
    Task.findOne({_id: ObjectID(req.params.taskId)})
        .then(task => {
            // check if task exists
            if (task) {
                // task should be in CREATED state
                if (task.status == taskStatus.CREATED) {
                    Task.findOneAndUpdate(
                        {_id: ObjectID(req.params.taskId)},
                        {
                            $push: {
                                selectedCandidates: req.body.selectedCandidates
                            }
                        },
                        {returnOriginal: false, useFindAndModify: false}
                    )
                        .then(task => {
                            console.log("Candidate selected successfully")

                            console.log("Checking if vacancy count is full" + task.vacancyCount)
                            if (task.selectedCandidates.length == task.vacancyCount) {
                                Task.findOneAndUpdate(
                                    {_id: ObjectID(req.params.taskId)},
                                    {
                                        $set: {
                                            status: taskStatus.PENDING
                                        }
                                    },
                                    {returnOriginal: false, useFindAndModify: false}
                                )
                                    .then(task => {
                                        console.log("Status updated to Pending successfully")
                                        // TODO: email all rejected candidates
                                        res.status(200).json({message: "Candidate selected successfully"})
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        Task.findOneAndUpdate(
                                            {_id: ObjectID(req.params.taskId)},
                                            {
                                                $pull: {
                                                    selectedCandidates: req.body.selectedCandidates
                                                }
                                            },
                                            {returnOriginal: false, useFindAndModify: false}
                                        )
                                        res.status(400).json({message: err})
                                    })
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(400).json({message: err})
                        });
                } else {
                    console.log("Candidate(s) cannot be selected at this time")
                    res.status(401).json({message: "Candidate(s) cannot be selected at this time"})
                }
            } else {
                console.log("Task does not exist")
                res.status(404).json({message: "Task does not exist"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({message: err})
        });
})

// @route   PUT api/tasks/complete/:taskId
// @desc    Mark a task as complete
// @access  Public
router.put("/complete/:taskId", (req, res) => {
    console.log("Inside Mark a task as complete for Task ID:", req.params.taskId);

    Task.findOne({_id: ObjectID(req.params.taskId)})
        .then(task => {
            // check if task exists
            if (task) {
                // check if status is In Progress
                if (task.status === taskStatus.INPROGRESS) {
                    // then mark status = Completed
                    // and set end date to current date
                    Task.findOneAndUpdate(
                        {_id: ObjectID(req.params.taskId)},
                        {
                            $set: {
                                status: taskStatus.COMPLETED,
                                endDate: new Date()
                            }
                        },
                        {returnOriginal: false, useFindAndModify: false}
                    )
                        .then(task => {
                            console.log("Task marked as completed successfully");
                            res.status(200).json({message: "Task marked as completed successfully"});
                        })
                        .catch(err => {
                            console.log("Task could not be modified");
                            res.status(400).json({message: "Task could not be modified"});
                        })
                } else {
                    // cannot complete the task
                    console.log("Cannot complete the task");
                    res.status(401).json({message: "Cannot complete the task"});
                }
            } else {
                console.log("Task does not exist");
                res.status(404).json({message: "Task does not exist"});
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({message: "Something went wrong"});
        });
});

// @route   GET api/tasks/search?title
// @desc    Fetch all tasks by title
// @access  Public
router.get("/search", (req, res) => {
    console.log("Inside GET request to fetch all tasks by title: " + req.query.title);

    Task.find({title: {$regex: new RegExp(req.query.title, "i")}})
        .then(tasks => {
            if (tasks.length != 0) {
                console.log("tasks fetched successfully for title: " + req.query.title);
                res.status(200).json({message: tasks});
            } else {
                console.log("No tasks found");
                res.status(404).json({message: "No tasks found"});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({message: err});
        })
});

// @route   PUT api/tasks/:taskId/apply
// @desc    Apply for a task
// @access  Public
router.put("/:taskId/apply", (req, res) => {
    console.log("Inside Apply for a Task for Task ID:", req.params.taskId);
    console.log("Influencer who is applying for the task: " + req.body.email);

    Task.findOne({_id: ObjectID(req.params.taskId)})
        .then(task => {
            // check if task exists
            if (task) {
                // check if task status is Created
                if (task.status === taskStatus.CREATED) {
                    // adding influencer's email to appliedCandidates list of the task
                    Task.findOneAndUpdate(
                        {_id: ObjectID(req.params.taskId)},
                        {
                            $addToSet: {
                                appliedCandidates: req.body.email
                            }
                        }
                    )
                        .then(task => {
                            // adding taskId to tasksApplied list of the Influencer
                            InfluencerProfile.findOneAndUpdate(
                                {email: req.body.email},
                                {
                                    $addToSet: {
                                        tasksApplied: req.params.taskId
                                    }
                                }
                            )
                                .then(influencer => {
                                    // if Influencer profile does not exists
                                    if (influencer == null) {
                                        console.log("Influencer Profile does not exists");
                                        // remove Influencer email from appliedCandidates list of the task
                                        Task.findOneAndUpdate(
                                            {_id: ObjectID(req.params.taskId)},
                                            {
                                                $pull: {
                                                    appliedCandidates: req.body.email
                                                }
                                            }
                                        )
                                            .catch(err => {
                                                console.log("Error in applying for the task");
                                                res.status(400).json({message: "Error in applying for the task"});
                                            })

                                        res.status(404).json({message: "Influencer Profile does not exists"});
                                    } else {
                                        console.log("Applied for task Successfully");
                                        res.status(200).json({message: "Applied for task Successfully"});
                                    }
                                })
                                .catch(err => {
                                    console.log("Something went wrong");

                                    // remove Influencer email from appliedCandidates list of the task
                                    Task.findOneAndUpdate(
                                        {_id: ObjectID(req.params.taskId)},
                                        {
                                            $pull: {
                                                appliedCandidates: req.body.email
                                            }
                                        }
                                    )
                                        .catch(err => {
                                            console.log("Something went wrong");
                                            res.status(400).json({message: "Something went wrong"});
                                        })

                                    res.status(400).json({message: "Something went wrong"});
                                })

                        })
                        .catch(err => {
                            console.log("Something went wrong");
                            res.status(400).json({message: "Something went wrong"});
                        })
                } else {
                    // cannot apply for the task
                    console.log("Cannot apply for the task");
                    res.status(401).json({message: "Cannot apply for the task"});
                }
            } else {
                console.log("Task does not exist");
                res.status(404).json({message: "Task does not exist"});
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({message: "Something went wrong"});
        });
});

// @route   GET api/tasks/unrated?taskId
// @desc    Fetch all unrated influencers for the given taskId
// @access  Public
router.get("/unrated", (req, res) => {
    console.log("Inside get all unrated influencers");

    Task.findOne({_id: ObjectID(req.query.taskId)})
        .then(async task => {
            let selectedCandidates = task.selectedCandidates
            let unratedCandidates = await Promise.all(selectedCandidates.map(candidate => {
                return Rating.findOne({
                    task: req.query.taskId,
                    influencer: candidate
                }).then(async (rating) => {
                    if (rating) {
                        return null;
                    } else {
                        let profileInfo = await fetchUserDetails(candidate);
                        if (await profileInfo != null) {
                            return {
                                name: await profileInfo.name.firstName + " " + await profileInfo.name.lastName,
                                email: await profileInfo.email
                            }
                        }
                    }
                })
            }))
            unratedCandidates = unratedCandidates.filter(c => c != null)
            res.status(200).json({success: true, message: unratedCandidates})
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({message: "Influencers could not be fetched"});
        })
});


module.exports = router;