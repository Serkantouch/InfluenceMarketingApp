import React, { Component } from "react";
import axios from "axios";
import "../../css/sponsorHome.css";
import WOW from "wow.js";
import $ from "jquery";
import Alert from "react-bootstrap/Alert";
import { connect } from "react-redux";
import {
  getSponsorInProgressTasks,
  getSponsorPendingTasks,
} from "../../actions/homeActions";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { TaskStatus } from "../../utils/Constants";

import {
  MDBCard,
  MDBCardTitle,
  MDBBtn,
  MDBCardGroup,
  MDBCardImage,
  MDBCardText,
  MDBCardBody,
  MDBBtnGroup,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBContainer,
  MDBRow,
  MDBCol,
} from "mdbreact";

class SponsorHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "sheena@gmail.com",
    };
  }
  componentDidMount() {
    const wow = new WOW();

    wow.init();

    this.props.getSponsorPendingTasks(this.state.email, TaskStatus.PENDING);
    this.props.getSponsorInProgressTasks(
      this.state.email,
      TaskStatus.INPROGRESS
    );
  }

  render() {
    console.log("All pending tasks", this.props.pendingtasks);
    console.log("All inprogress tasks", this.props.inprogresstasks);

    return (
      <div class="border">
        {/* PENDING DIV*/}
        <div
          class="container-lg ml-8 mt-5 border rounded"
          style={{ padding: "2%" }}
        >
          <div>
            <br /> <h2> PENDING TASKS </h2>{" "}
          </div>

          <div class="row ">
            <div class="col-lg-6 col-md-6 col-sm-6 text-right">
              <button type="button" class="btn btn-outline-primary">
                <i class="fas fa-arrow-left"></i>
              </button>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-6 text-left">
              <button type="button" class="btn btn-outline-primary text-center">
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
          <br />
          <div class="card-deck">
            <div class="card">
              <img
                class="card-img-top"
                src="https://www.somagnews.com/wp-content/uploads/2020/01/b8-1-e1577995435435-696x382.jpg"
                alt="Card image cap"
              />
              <div class="card-body">
                <h5 class="card-title">Grand Theft Auto 6</h5>
                <p class="card-text">
                  Grand Theft Auto 6 is available in market now! This is one of
                  the most awaited version of our game.
                </p>
                <p class="card-text">
                  The candidates job will be to play the game daily and share
                  some of their screen recordings on their Instagram account. We
                  need a minimum of 5 videos and 7 pictures to be shared daily.
                </p>
              </div>
              <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
              </div>
            </div>
            <div class="card">
              <img
                class="card-img-top"
                src="https://cdn3.dpmag.com/2017/09/002a-beautyshot.jpg"
                alt="Card image cap"
              />
              <div class="card-body">
                <h5 class="card-title">H1 Camera Kit</h5>
                <p class="card-text">
                  The innovative H1 lets you switch from manual or autofocus,
                  and accepts digital backs, like the Leaf Valeo 22, letting you
                  switch between digital and analog recordings.
                </p>
              </div>
              <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
              </div>
            </div>
            <div class="card">
              <img
                class="card-img-top"
                src="https://firebasestorage.googleapis.com/v0/b/masterfinalproject-4583d.appspot.com/o/tasks%2Fhrichardson%40shaffer.com_up-energy-drink.jpg?alt=media&token=16d2aff6-a8b7-4c9e-8d5b-ed758fdbc5b1"
                alt="Card image cap"
              />
              <div class="card-body">
                <h5 class="card-title">Up Energy Drink</h5>
                <p class="card-text">
                  Instagram fitness influencer with minimum 1000 followers
                  needed to promote Christian Guzman's new Up Energy Drink. The
                  ad must be a video and needs to be atleast 30 seconds.
                </p>
              </div>
              <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
              </div>
            </div>
          </div>
          <br />
          <div class="row">
            {" "}
            <div class="col-md-10 col-sm-10 col-lg-10"></div>
            <div class="col-md-2 col-sm-2 col-lg-2">
              <h5> See More </h5>{" "}
            </div>
          </div>
        </div>
        <div>
          {" "}
          <br /> <br /> <hr />{" "}
        </div>
        {/* IN PROGRESS DIV*/}
        <div
          class="container-lg ml-8 mt-5 border rounded"
          style={{ padding: "2%" }}
        >
          <div>
            <br /> <h2> IN PROGRESS TASKS </h2>{" "}
          </div>

          <div class="row ">
            <div class="col-lg-6 col-md-6 col-sm-6 text-right">
              <button type="button" class="btn btn-outline-primary">
                <i class="fas fa-arrow-left"></i>
              </button>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-6 text-left">
              <button type="button" class="btn btn-outline-primary text-center">
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
          <br />
          <div class="card-deck">
            <div class="card">
              <img
                class="card-img-top"
                src="https://images.homedepot-static.com/productImages/6bf97df0-9694-4916-9d33-297252793cc1/svn/shadedeye-safety-glasses-sunglasses-85901-16-64_1000.jpg"
                alt="Card image cap"
              />
              <div class="card-body">
                <h5 class="card-title">Fossil Sun glasses</h5>
                <p class="card-text">
                  These Fossil sunglasses come in a sport-wrap design, providing
                  a sleek, sporty look for your active lifestyle. In seach of
                  influencers who can market this product.
                </p>
              </div>
              <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
              </div>
            </div>
            <div class="card">
              <img
                class="card-img-top"
                src="https://static.turbosquid.com/Preview/001271/323/A5/_Z.jpg"
                alt="Card image cap"
              />
              <div class="card-body">
                <h5 class="card-title">GameX Switch Console</h5>
                <p class="card-text">
                  Whether you're into gaming, HD movies, television, music, or
                  all of the above, GameX offers something great for everyone.
                </p>
              </div>
              <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
              </div>
            </div>
            <div class="card">
              <img
                class="card-img-top"
                src="https://img.gkbcdn.com/s3/p/2019-01-16/makibes-t3-smart-watch-black-1571984501939.jpg"
                alt="Card image cap"
              />
              <div class="card-body">
                <h5 class="card-title">TimeX Smart Watch</h5>
                <p class="card-text">
                  The ultimate device for a healthy life. Most advanced watch in
                  the world! Any case, Any band, Any style you want!
                </p>
              </div>
              <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
              </div>
            </div>
          </div>
          <br />
          <div class="row">
            {" "}
            <div class="col-md-10 col-sm-10 col-lg-10"></div>
            <div class="col-md-2 col-sm-2 col-lg-2">
              <h5> See More </h5>{" "}
            </div>
          </div>
        </div>
        <div>
          {" "}
          <br /> <br /> <hr />{" "}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  pendingtasks: state.home.pendingtasks,

  inprogresstasks: state.home.inprogresstasks,
});

//function mapDispatchToProps

export default connect(mapStateToProps, {
  getSponsorPendingTasks,
  getSponsorInProgressTasks,
})(SponsorHome);
