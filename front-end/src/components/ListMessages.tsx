import React, { Component, memo, useContext, createRef } from "react";
import { IState as Props, IContext as Context } from "../App";
import MessageInstance from "./MessageInstance";
import AuthUserContext from "../contexts/AuthUserContext";
interface IProps {
	messages: Props["message"][];
	setMessages: React.Dispatch<React.SetStateAction<Props["message"][]>>;
}

interface Istate {
	loading: boolean;
}
class ListMessages extends Component<IProps> {
	static contextType : React.Context<Context['user']> = AuthUserContext;
	context !: React.ContextType<typeof AuthUserContext>;
	//idk why this doesn't work and I am done trying to fix it
    //declare context: React.ContextType<typeof AuthUserContext>;

	//reference to our current ul element for scrolling
	private ulRef = createRef<HTMLUListElement>();
	//create a ref for a ul element for scrolling
	state : Istate = {
		loading: false
	}
	constructor(props: IProps) {
		super(props);
		this.ulRef = createRef();

	}
	//? scroll to the bottom of the list

	componentDidMount(): void {
		//? sets initial value of states
		this.setState({ loading: false });
	}
	getSnapshotBeforeUpdate (prevpros : IProps, prevstate : Istate) : number | boolean {
			const ulRef = this.ulRef.current as HTMLUListElement;
			//? if the new messages are being loaded
			//* returns the first element of the previous list to which we will scroll to, to avoid scrolling to the top of new list
			if(prevstate.loading === true){
				return ulRef.scrollHeight
			}
			//? we there have been added a new message and user isn't scrolled up or chat has changed
			//* returns true, thus scrolling to the bottom of the list
			return (this.props.messages.length > prevpros.messages.length && (ulRef.scrollTop + ulRef.clientHeight === ulRef.scrollHeight)) ||
				(this.props.messages.length !== 0 && prevpros.messages.length !== 0 && (this.props.messages[0].chat !== prevpros.messages[0].chat));


		}
	componentDidUpdate (prevpros : IProps, prevstate : Istate, snapshot : number | boolean) {
		
		//? if we are loading new messages the scroll should not follow to the top of new list
		if(typeof snapshot === 'number'){
			//? scrolls to the first element of the previous list
			const ulRef = this.ulRef.current as HTMLUListElement;
			ulRef.scroll({ behavior: "auto" ,top: ulRef.scrollHeight - snapshot,});
		}
		else if(snapshot){
			//? scrolls to the bottom of the list
			const ulRef = this.ulRef.current as HTMLUListElement;
			ulRef.scroll({ behavior: "smooth" ,top: ulRef.scrollHeight - ((ulRef.lastElementChild != null) ? ulRef.lastElementChild?.scrollHeight : 0),});
		}

	}
	async fetchMoreMessages () {
		//? get the length of the messages array
		let size : number = this.props.messages.length;
		//? get the url of the chat
		let url : string = this.props.messages[0].chat;
		//? get the next page of messages from the api
		const res = await fetch(url + "messages/?offset=" + size);
		//console.log("fetching for older messages attempt", res)
		const data = await res.json();
		//console.log("data before",data);
		const msgs = data.results.reverse().map(({url, text, author, author_name, chat, created_at, updated_at }: any) => ({
			url,
			text,
			author,
			author_name,
			chat,
			created_at,
			updated_at
		}));
		//console.log("data after",msgs);
		//? update the state of the messages to include the older messages
		this.props.setMessages(messages => [ ...msgs,...messages,]);

		//console.log("state of messages",this.props.messages)
		//? set loading to false after we are done updating the messages
		this.setState((state) => ({loading: false}));
		return;





	}
	handleScroll = () => {
		const ulRef = this.ulRef.current as HTMLUListElement;
		if(ulRef.scrollTop === 0){
			//console.log("top reached")
			this.setState((state) => ({loading: true}), this.fetchMoreMessages)
			//console.log("loading2",this.state.loading)
		}

	}

	render() {
		const { messages } = this.props;
		const RenderList = (): JSX.Element[] => {
			return messages?.map((msg) => {
				const classname =
					msg.author === this.context.url
						? "list-Messages-item-Author"
						: "list-Messages-item-Other";
				return (
					<li className={classname} key={msg.url.toString()}>
						<MessageInstance message={msg} />
					</li>
				);
			});
		};
		return <ul className="list-Messages" ref = {this.ulRef} onScroll={this.handleScroll} >
			{RenderList()}
			</ul>;
	}
}

export default ListMessages;
