import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import "./header.css"

const Header = () => (
    <>
        <div className="nav-header">
            <Link to="/" className="nav-brand">
                NishiWare
            </Link>
            {/* remember to change this link later */}
            <Link to="https://github.com/bnishimura/" className="nav-link" >
                <StaticImage 
                src="../images/github-logo.png" 
                alt="github logo" 
                height={32}
                width={32}
                />
            </Link>
        </div>
        <hr className="content-hr" />
    </>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
