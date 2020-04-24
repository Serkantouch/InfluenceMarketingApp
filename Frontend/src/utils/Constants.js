//TODO: update MY_USER_ID and MY_ROLE to get form localStorage 
const MY_USER_ID = 'sheena@gmail.com'
const MY_ROLE = "Sponsor"
const UserRoles = {
    SPONSOR: "Sponsor",
    INFLUENCER: "Influencer"
}

const TaskStatus = {
    CREATED: 'Created',
    INPROGRESS: 'In Progress',
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    APPLIED: 'Applied',
    ALL: "All"
}

const TaskCategories = [
    "Movies & TV",
    "Food",
    "Travel",
    "Sports & Outdoors",
    "Fitness & Gym",
    "Automobile",
    "Beauty and Personal Care",
    "Video Games",
    "Electronics",
    "Health",
    "Education",
    "Photography"
];

const Gender = [
    "Female",
    "Male",
    "Other"
];

const NoImageFoundForTask = "https://firebasestorage.googleapis.com/v0/b/masterfinalproject-4583d.appspot.com/o/tasks%2FnoImageFound.jpg?alt=media&token=cad1cdd5-4571-4192-8962-d67f42a54cdb";

export {UserRoles, TaskStatus, TaskCategories, Gender, MY_USER_ID, MY_ROLE, NoImageFoundForTask}