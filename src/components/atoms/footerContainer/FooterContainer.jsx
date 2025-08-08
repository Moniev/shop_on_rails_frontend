import "./FooterContainer.scss"

const FooterContainer = ({ leftContent, rightContent }) => {
    return (
        <div className="footer-container">
            <div className="footer-container-left">
                {leftContent}
            </div>
            <div className="footer-container-right">
                {rightContent}
            </div>
        </div>
    )
}

export default FooterContainer;