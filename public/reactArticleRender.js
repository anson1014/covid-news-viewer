'use strict';

class Article extends React.Component {
    render() {
        return (
            <div className='news'>
                <a href={this.props.link}>
                    <h3>{this.props.title}</h3>
                </a>
                <p>{this.props.description}</p>
            </div>
        );
    }
}

const renderArticle = (title, description, link) => {
    const element = (
        <Article title={title} description={description} link={link} />
    );
    const domContainer = document.getElementById('breaking-news');
};

export { renderArticle };



