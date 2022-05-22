import React from "react"
import { Helmet } from "react-helmet"
import { Link, graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"

import Layout from "../components/layout"
import './blog_post.css';

export default function Template({ data }) {
    const post = data.mdx
    return (
        <>
        <Helmet>
            <title>NishiWare - {post.frontmatter.title}</title>
        </Helmet>

        <Layout>
        <div className="blog-post-container">
            <div className="post-header">
                <h1 className="post-title">{post.frontmatter.title}</h1>
                <p className="post-date">{post.frontmatter.date}</p>
            </div>
            <div className="blog-post-content">
                <MDXRenderer>{post.body}</MDXRenderer>
            </div>
        </div>
        </Layout>
        </>
    )
}

export const pageQuery = graphql`
    query BlogPostByPath($path: String!) {
        mdx(frontmatter: { path: { eq: $path } }) {
            body
            frontmatter {
                date(formatString: "MMMM DD, YYYY")
                path
                title
                }
            }
        }
    `
