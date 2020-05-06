import React, { Component } from "react";
import SponsorHome from "./SponsorHome";
import InfluencerHome from "./InfluencerHome";
import { UserRoles } from "../../utils/Constants";
import { getRoleFromLocalStorage } from "../Common/auth";
import InfluencerAnalytics from "../analytics/InfluencerAnalytics";

class Home extends Component {
  render() {
    const role = getRoleFromLocalStorage();
    let rating =
      role === UserRoles.INFLUENCER ? (
        <InfluencerHome />
      ) : (
        <SponsorHome></SponsorHome>
      );
    return rating;
  }
}

export default Home;
