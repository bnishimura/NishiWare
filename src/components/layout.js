import * as React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div className="main-container">
      <Helmet>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto"/>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css2?family=Anton&family=Roboto:wght@100&display=swap" rel="stylesheet"/>
      </Helmet>

      <Header />

      <div
        style={{
          maxWidth: `var(--size-content)`,
          marginBottom: `var(--size-gutter)`,
        }}
      >

        <main>{children}</main>

        <hr className="content-hr"
        style={{
            marginTop: `var(--space-4)` 
        }}
        />

        <footer >
        <p> The code for this blog can be found <a href="">here</a>.</p>

        <p> © {new Date().getFullYear()} &middot; Built with
          {` `}
          <a href="https://www.gatsbyjs.com">Gatsby</a></p>
        </footer>
      </div>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
