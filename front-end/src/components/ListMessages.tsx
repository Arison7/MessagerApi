import React, { Component, memo, useContext } from "react";
import { IState as Props, IContext as Context } from "../App";
import MessageInstance from "./MessageInstance";
import AuthUserContext from "../contexts/AuthUserContext";
interface IProps {
	messages: Props["message"][];
}

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

class ListMessages extends Component<IProps> {
	static contextType : React.Context<Context['user']> = AuthUserContext;
    declare context: React.ContextType<typeof AuthUserContext>;
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
		return <ul className="list-Messages">{RenderList()}</ul>;
	}
}

export default ListMessages;
