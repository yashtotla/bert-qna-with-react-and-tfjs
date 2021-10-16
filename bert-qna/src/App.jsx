import React, { useRef, useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'

// import dependencies
import * as TF from "@tensorflow/tfjs"
import * as QNA from "@tensorflow-models/qna"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from "react-loader-spinner"
import { Fragment } from 'react'

function App() {

	// reference hooks
	const passageRef = useRef(null);
	const questionRef = useRef(null);

	// state hooks
	const [answer, setAnswer] = useState();
	const [model, setModel] = useState(null);

	// load the tensorflow model
	const loadModel = async () => {
		console.log("inititalizing app")
		const qnaModel = await QNA.load()
		setModel(qnaModel);
		console.log("model loaded successfully")
	}

	// load the model when the app starts
	useEffect(() => { loadModel() }, []);

	const answerQuestion = async (e) => {
		if (e.which === 13 && model !== null) {
			console.log("submitting question")
			const p = passageRef.current.value;
			const q = questionRef.current.value;
			const a = await model.findAnswers(q, p);
			setAnswer(a);
		}
	}

	return (
		<div className="App">
			{model == null ?
				<div>
					<span>Loading your QnA application</span>
					<Loader type="Puff" height={100} width={100}></Loader>
				</div> :
				<Fragment>
					<span>Passage</span>
					<textarea ref={passageRef} rows='30' cols='100'></textarea>
					<span>Question</span>
					<textarea ref={questionRef} onKeyPress={answerQuestion} rows='2' cols='100'></textarea>
					<span>Answer</span>
					{answer ? answer.map((ans, idx) =>
						<div>
							<span>{idx + 1}.: {ans.text}</span>
							<i>score: {ans.score * 100 / 100}</i>
						</div>)
						: ''}
				</Fragment>
			}
		</div>
	)
}

export default App
