import React from 'react'
import './subscribe.css'

class Subscribe extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      emailValue: '',
      nameValue: '',
      robotValue: '',
    }
  }

  handleEmailInput = event => {
    this.setState({
      emailValue: event.target.value,
    })
  }

  handleNameInput = event => {
    this.setState({
      nameValue: event.target.value,
    })
  }

  handleRobot = event => {
    this.setState({
      robotValue: event.target.value,
    })
  }

  render() {
    let bgClass
    if (this.props.hasBackground) {
      bgClass = 'mailchimp-signup mailchimp-signup--white-bg'
    } else {
      bgClass = 'mailchimp-signup'
    }
    return (
      <div className={bgClass}>
        <form
          className="mailchimp-signup__form"
          action="https://twitter.us12.list-manage.com/subscribe/post"
          method="POST"
        >
          <h2>{this.props.title}</h2>
          <input type="hidden" name="u" value="f3d8a4a93db24975a2da9565b" />
          <input type="hidden" name="id" value="1e7e011a5b" />
          <div className="mailchimp-signup__email">
            <label htmlFor={`${this.props.id}-MERGE0`}>Email Address</label>
            <input
              type="email"
              autocapitalize="off"
              autocorrect="off"
              name="MERGE0"
              id={`${this.props.id}-MERGE0`}
              size="25"
              style={{
                borderColor: this.props.color,
                color: this.props.color,
                fontSize: '1rem',
              }}
              value={this.state.emailValue}
              onChange={this.handleEmailInput}
            />
          </div>
          <div className="mailchimp-signup__name">
            <label htmlFor={`${this.props.id}-MERGE1`}>First Name</label>
            <input
              type="text"
              name="MERGE1"
              id={`${this.props.id}-MERGE1`}
              size="25"
              style={{
                borderColor: this.props.color,
                color: this.props.color,
                fontSize: '1rem',
              }}
              value={this.state.nameValue}
              onChange={this.handleNameInput}
            />
          </div>
          <div style={{ position: 'absolute', left: -5000 }} aria-hidden="true">
            <label htmlFor={`${this.props.id}-test`}>Name:</label>
            <input
              id={`${this.props.id}-test`}
              type="text"
              name="b_f3d8a4a93db24975a2da9565b_1e7e011a5b"
              tabindex="-1"
              value={this.state.robotValue}
              onChange={this.handleRobot}
            />
          </div>
          <div className="mailchimp-signup__submit">
            <input type="submit" name="submit" value="Subscribe" />
          </div>
        </form>
      </div>
    )
  }
}

export default Subscribe
