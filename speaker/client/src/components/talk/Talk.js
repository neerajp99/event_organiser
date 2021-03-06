import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Side from "../sidebar/Sidebar";
// import Select from "react-select";
import { Container, InnerContainer } from "../../styles/Commons";
import {
  TalkContainer,
  TalkHeading,
  FormGroup,
  TalkSubmitButton,
  NullInfo
} from "./styles/talk";
import CreatableSelect from "react-select/creatable";
import TalkInputField from "./TalkInputField";
import TalkAreaField from "./TalkAreaField";
import { Label } from "./styles/talk";
import { connect } from "react-redux";
import { createTalk } from "../../actions/talkActions.js";
import PropTypes from "prop-types";
import Select from "react-select";
import { getMyTalks } from "../../actions/myTalkActions";
import Spin from "../../util/Spinner";
import isEmpty from "../../validation/isEmpty"

const audienceOptions = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Expert", label: "Expert" },
  { value: "All", label: "All" }
];

const durationOptions = [
  { value: "30 Minutes", label: "30 Minutes" },
  { value: "45 Minutes", label: "45 Minutes" },
  { value: "60 Minutes", label: "60 Minutes" },
  { value: "workshop", label: "Workshop (3 Hours)" }
];

class Talk extends Component {
  state = {
    title: "",
    elevatorPitch: "",
    talkDuration: "",
    audienceLevel: "",
    description: "",
    additionalDetails: "",
    outcome: "",
    wordCount: 0,
    tags: null,
    loading: true,
    talksLength: null
  };

  componentDidMount() {
    this.props.getMyTalks();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.myTalks.myTalks !== prevState.talks) {
      if (nextProps.myTalks.myTalks !== null) {
        let talksLength = nextProps.myTalks.myTalks.length;
        return {
          talksLength,
          loading: false
        };
      }
    }
    return null;
  }

  handleChange = (newValue: any, actionMeta: any) => {
    // console.group("Value Changed");
    // console.log(newValue)
    if (actionMeta.name === "tags") {
      this.setState({
        [actionMeta.name]: newValue
      });
    } else {
      if (isEmpty(newValue)) {
        this.setState({
          [actionMeta.name]: ""
        })
      } else {
        this.setState({
          [actionMeta.name]: newValue.value
        });
      }
    }
    // console.log(`action: ${actionMeta.name}`);
    // console.groupEnd();
  };
  handleInputChange = (inputValue: any, actionMeta: any) => {
    // console.group("Input Changed");
    // console.log(inputValue);
    // console.log(`action: ${actionMeta.action}`);
    // console.groupEnd();
  };

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // Restrict word limit in textarea
  setFormattedContent = (text, limit) => {
    let words = text.split(" ");
    if (words.filter(Boolean).length > limit) {
      this.setState({
        elevatorPitch: text
          .split(" ")
          .slice(0, limit)
          .join(" "),
        wordCount: limit
      });
    } else {
      this.setState({
        elevatorPitch: text,
        wordCount: words.filter(Boolean).length
      });
    }
  };
  // For limiting the characters
  //   text.length > limit
  //     ? this.setState({ elevatorPitch: text.slice(0, limit) })
  //     : this.setState({ elevatorPitch: text });
  // };
  onSubmitForm = event => {
    event.preventDefault();
    const newTalk = {
      talk: this.state.title,
      elevatorPitch: this.state.elevatorPitch,
      talkDuration: this.state.talkDuration,
      audienceLevel: this.state.audienceLevel,
      description: this.state.description,
      additionalDetails: this.state.additionalDetails,
      outcome: this.state.outcome,
      talkTags: this.state.tags
    };
    this.props.createTalk(newTalk, this.props.history);
  };
  render() {
    const {
      title,
      elevatorPitch,
      talkDuration,
      audienceLevel,
      description,
      additionalDetails,
      outcome,
      wordCount,
      talksLength,
      loading
    } = this.state;

    return (
      <Container>
        <Side />
        <InnerContainer>
          {talksLength === null || loading ? (
            <Spin />
          ) : (
            <TalkContainer>
             <TalkHeading>Create Talk</TalkHeading>
              {talksLength > 2 ? (
                <NullInfo>You have already submitted 3 talks!</NullInfo>
              ) : (
                <form noValidate>
                <br />
                  <FormGroup>
                    <TalkInputField
                      placeholder="Talk Title"
                      name="title"
                      value={title}
                      onChange={this.onChange}
                      label="Title"
                      type="text"
                    />
                    <TalkAreaField
                      placeholder="Elevator Pitch in less than 100 words"
                      name="elevatorPitch"
                      value={elevatorPitch}
                      length={wordCount}
                      onChange={event =>
                        this.setFormattedContent(event.target.value, 100)
                      }
                      label="Elevator Pitch "
                      type="text"
                      limit={100}
                    />
                    <TalkAreaField
                      placeholder="Detailed Description of the talk"
                      name="description"
                      value={description}
                      onChange={this.onChange}
                      label="Talk description "
                      type="text"
                    />
                    <Label htmlFor="label">Audience Level</Label>
                    <CreatableSelect
                      isClearable
                      onChange={this.handleChange}
                      onInputChange={this.handleInputChange}
                      options={audienceOptions}
                      id="dropdownSelect"
                      name="audienceLevel"
                    />
                    <Label htmlFor="label">Talk Duration</Label>
                    <CreatableSelect
                      isClearable
                      onChange={this.handleChange}
                      onInputChange={this.handleInputChange}
                      options={durationOptions}
                      id="dropdownSelect"
                      name="talkDuration"
                    />
                    <Label htmlFor="label">Talk Tags</Label>
                    <Select
                      isMulti
                      name="tags"
                      options={durationOptions}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      id="dropdownSelect"
                      onChange={this.handleChange}
                      onInputChange={this.handleInputChange}
                    />
                    <TalkAreaField
                      placeholder="Enter any additional detail here"
                      name="additionalDetails"
                      value={additionalDetails}
                      onChange={this.onChange}
                      label="Additional Details "
                      type="text"
                    />
                    <TalkAreaField
                      placeholder="Enter the outcome of the talk."
                      name="outcome"
                      value={outcome}
                      onChange={this.onChange}
                      label="Talk Outcome "
                      type="text"
                    />
                    <TalkSubmitButton onClick={this.onSubmitForm}>
                      Submit Talk
                    </TalkSubmitButton>
                  </FormGroup>
                </form>
              )}
            </TalkContainer>
          )}
        </InnerContainer>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  myTalks: state.mytalks
});

Talk.propTypes = {
  auth: PropTypes.object.isRequired,
  createTalk: PropTypes.func.isRequired,
  myTalks: PropTypes.object.isRequired,
  getMyTalks: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { createTalk, getMyTalks }
)(withRouter(Talk));
