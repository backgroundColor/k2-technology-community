import React from 'react'
import './QuestionDescription.scss'
import Editor from 'components/LiteEditor'
import 'font-awesome/css/font-awesome.css'
import localStorage from 'localforage'
import { Link } from 'react-router'

type Props = {
  id: String,
  cb: String,
  question: Object,
  replies: Object,
  getDescription: Function,
  reply: Function,
  doLike: Function
};
export class QuestionDescription extends React.Component {
  props: Props;

  constructor (props) {
    super(props)
    this.handleReplyState = this.handleReplyState.bind(this)
    this.handleLike = this.handleLike.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.state = {
      replyState: false
    }
  }

  handleLike () {
    this.props.doLike('question', this.props.question._id, '', '+')
  }

  handleReplyState () {
    this.setState({ replyState: !this.state.replyState })
    this.refs.replyBtn.style.display = this.refs.replyBtn.style.display === 'none' ? 'inline-block' : 'none'
  }

  handleEdit () {
    localStorage.setItem('reEdit', JSON.stringify({
      id: this.props.question._id,
      title: this.props.question._source.title,
      content: this.props.question._source.content,
      tags: this.props.question._source.tags,
      author: this.props.question._source.author,
      likes: this.props.question._source.likes
    }))
    window.setTimeout(() => {
      document.getElementById('linkToEditor').click()
    }, 500)
  }

  componentWillMount () {
    this.props.getDescription(this.props.id)
  }

  componentDidUpdate () {
    if (this.props.question) {
      this.refs.content.innerHTML = this.props.question._source.content
    }
    if (this.props.cb === 'success') {
      location.reload()
    }
  }

  render () {
    var date = new Date(this.props.question && this.props.question._source.createdTime)
    return (
      <div className='QuestionDescription'>
        <section className='question-author'>
          <div className='question-author-name'>
            {this.props.question && this.props.question._source.author}
          </div>
        </section>
        <div className='qD-icon'>
          { this.props.replies && this.props.replies.hits.hits.length === 0
            ? <i className='fa fa-comment-o qD-icon-start' />
            : <i className='fa fa-comments-o qD-icon-ing' />
          }
        </div>
        <section className='question-content'>
          <div className='question-title'>{this.props.question && this.props.question._source.title}</div>
          <div ref='content' className='question-content-maintext' />
          <div className='quesion-created-time'>发布日期 {date.toLocaleString()}</div>
          <button ref='replyBtn' className='question-reply-btn' onClick={this.handleReplyState}>回复</button>
          <button className='question-agree-btn' onClick={this.handleLike}>
            我也有此问题({this.props.question && this.props.question._source.likes})
          </button>
          <Link id='linkToEditor' to='/new' />
          <button className='question-agree-btn question-edit-btn' onClick={this.handleEdit}>编辑</button>
        </section>
        {
          this.state.replyState && (
            <section className='question-reply-editor'>
              <Editor to={this.props.question && this.props.question._source.author} cd={this.props.cb}
                reply={this.props.reply} cancel={this.handleReplyState}
                id={this.props.question && this.props.question._id} />
            </section>
          )
        }
        <section className='question-raplies'>
          <div className='question-raplies-title'>所有回复</div>
        </section>
      </div>
    )
  }
}

export default QuestionDescription
