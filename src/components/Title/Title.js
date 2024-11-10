import "./Title.sass"

function Title({title, buttonText, onButtonClick}) {
    return (
        <div className="title">
            <h1 className="title__heading">{title}</h1>
            <button className="title__button" onClick={onButtonClick}>Add {buttonText} +</button>
        </div>
    )
}

export default Title