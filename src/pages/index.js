// home page stuff
import React, { useEffect, useState, useRef } from "react"
import { Link, graphql } from "gatsby"
import { Helmet } from "react-helmet"

import Layout from "../components/layout"
import TagFilter from "../components/tag_filter"
import Tags from "../components/tags"
import "./index.css"

export default function Home({ data }) {
    const posts = data.allMdx.edges;
    const filters = useRef([]);
    const [stateCount, setCount] = useState(0);

    const filter_posts = () => {
        if (filters.current.length)
            return posts.filter( post => 
                post.node.frontmatter.tags.filter(tag =>
                    filters.current.includes(tag)).length)
        else
            return posts;
    }

    const filtered_posts = filter_posts();
    useEffect(filter_posts, [stateCount]);

    // fetch all available tags on posts
    const tagCount = {};
    posts.forEach( ({ node: post }) => {
        post.frontmatter.tags?.forEach( tag => {
            Object.hasOwn(tagCount, tag) ?
            tagCount[tag]++ :
            tagCount[tag] = 1;
            return;
        }
        )});

    // const tags = Object.keys(tagCount);
    const homeInfo = {
        // give available tags so tag_filter knows what to render
        tags : Object.keys(tagCount),  
        filters : filters,  // pass filters so tag_filter can change it
        stateCount : stateCount,
        setCount : setCount,  // pass setCount so it can change index's state
    }

    return (
        <>
        <Helmet>
            <title>NishiWare - Home</title>
        </Helmet>

        <Layout>
            <TagFilter homeInfo={homeInfo} />
            <div className="page-content">
                {filtered_posts ? filtered_posts.map(({ node: post }) => {
                        return (
                            <div className="post-preview" key={post.id}>
                                <h1>
                                    <Link 
                                        to={post.frontmatter.path}
                                        className="post-preview-title"
                                    >
                                        {post.frontmatter.title}
                                    </Link>
                                </h1>
                                <div className="post-sub-header">
                                    <div className="post-date" >
                                        {post.frontmatter.date} 
                                    </div>
                                    { post.frontmatter.tags.map((tag, index) => {
                                    return (
                                        <Tags key={index}>{ tag }</Tags>
                                    )})}
                                </div>
                                <p className="post-excerpt">{post.frontmatter.excerpt}</p>
                            </div>
                        ) 
                    }) : null }
            </div>
        </Layout>
        </>
    )
}

export const pageQuery = graphql`
    query IndexQuery {
        allMdx(sort: { order: DESC, fields: [frontmatter___date] }) {
            edges {
                node {
                    id
                    frontmatter {
                        excerpt
                        title
                        date(formatString: "MMMM DD, YYYY")
                        tags
                        path
                    }
                }
            }
        }
    }
`
