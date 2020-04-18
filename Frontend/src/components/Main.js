import React, {Component} from "react";
import {Route} from "react-router-dom";
import SponsorDashboard from "./Dashboard/SponsorDashboard";
import UserProfile from "./UserProfile/userProfile";
import Messenger from './Inbox/Messenger'

class Main extends Component {
    render() {
        return (
            <div>
                <Route path="/dashboard/sponsor" component={SponsorDashboard} />
                <Route path="/profile" exact component={UserProfile}/>
                <Route path="/inbox" component={Messenger} />
            </div>
        );
    }
}

export default Main;
