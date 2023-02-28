import React, { Component, memo, useContext, createRef } from "react";
import { IState as Props, IContext as Context } from "../App";
import MessageInstance from "./MessageInstance";
import AuthUserContext from "../contexts/AuthUserContext";
interface IProps {
	messages: Props["message"][];
}
/*
back up 
const ListMessagesFunctional: React.FC<IProps> = memo(({ messages }) => {
	const user = useContext(AuthUserContext);
	const RenderList = (): JSX.Element[] => {
		return messages?.map((msg) => {
			const classname =
				msg.author === user.url
					? "list-Messages-item-Author"
					: "list-Messages-item-Other";
			return (
				<li className={classname} key={msg.url.toString()}>
					<MessageInstance message={msg} />
				</li>
			);
		});
	};
	return <ul className="list-Messages">{RenderList()}</ul>;
});
*/
class ListMessages extends Component<IProps> {
	static contextType : React.Context<Context['user']> = AuthUserContext;
	context !: React.ContextType<typeof AuthUserContext>;
	//idk why this doens't work and I am done trying to fix it
    //declare context: React.ContextType<typeof AuthUserContext>;

	//reference to our current ul element for scrolling
	private ulRef = createRef<HTMLUListElement>();
	//create a ref for a ul element for scrolling

	constructor(props: IProps) {
		super(props);
		this.ulRef = createRef();

	}

	getSnapshotBeforeUpdate (prevpros : IProps, prevstate : IProps['messages']) : number | null {
		if(this.props.messages.length > prevpros.messages.length){
			return this.ulRef?.current?.scrollHeight as number - (this.ulRef?.current?.clientHeight as number);	}
		return null;
	}
	componentDidUpdate (prevpros : IProps, prevstate : IProps['messages'], snapshot : number | null) {
		if(snapshot !== null){
			const ulRef = this.ulRef.current as HTMLUListElement;
			ulRef.scrollTop =  ulRef.scrollHeight - snapshot;
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
		return <ul className="list-Messages" ref = {this.ulRef}>
			{RenderList()}
			</ul>;
	}
}

export default ListMessages;
