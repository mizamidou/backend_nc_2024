const request = require('supertest')
const app= require('../app')
const db= require('../db/connection')
const seed =require('../db/seeds/seed')
const testData= require('../db/data/test-data')
const endpoints= require('../endpoints.json')

beforeEach(() => {return seed(testData)})
afterAll(() => db.end())



describe("api/topics" ,()=>{
    test("GET:array of objects topics with slug and description property", ()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) =>{
            expect(Array.isArray(response.body.topics)).toBe(true)
            expect(response.body.topics.length).toBe(3)
            response.body.topics.forEach((topic) =>{
            expect(typeof topic.slug).toBe('string')
            expect(typeof topic.description).toBe('string')
            })
        })
    })
    test("GET:non existing route returns 404", ()=>{
        return request(app)
        .get('/api/topics/notARoute')
        .expect(404)
        .then((response) =>{
            expect(response.body.msg).toBe('Invalid point')
            })
        })

})

describe("GET: API endpoints", () =>{
    test('GET:object of endpoints with description,queries, exampleResponse, articles', ()=>{
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) =>{
            expect(response.body).toHaveProperty('endpoints')
            expect(response.body.endpoints).toEqual(endpoints)
            

        })
    })

})


describe("GET /api/articles/:article_id", () =>{
    test('GET:an array of objects with properties author, title, article_id, body', ()=>{
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) =>{
                const article= response.body.article
                console.log(article)
                expect(typeof article.author).toBe('string')
                expect(typeof article.title).toBe('string')
                expect(typeof article.article_id).toBe('number')
                expect(typeof article.body).toBe('string')
                expect(typeof article.topic).toBe('string')
                expect(typeof article.created_at).toBe('string')
                expect(typeof article.votes).toBe('number')
                expect(typeof article.article_img_url).toBe('string')
            
        })
    })

    test("GET:404 if article_id is not valid number", ()=>{
        return request(app)
        .get('/api/articles/invalidNumber')
        .expect(400)
        .then((response) =>{
            expect(response.body.msg).toBe('Invalid point')
            })
        })

}) 

describe('GET /api/articles', ()=>{
    test('GET:AN OBJECT common_count, total count of all comments in each article_id ', ()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then ((response) =>{
            expect(Array.isArray(response.body.articles)).toBe(true)
            response.body.articles.forEach((article) =>{
                expect(typeof article.comment_count).toBe('string')
            })
        })
    })
    test('GET:return articles without the body', ()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then ((response) =>{
            response.body.articles.forEach((article) =>{
                expect(article).not.toHaveProperty('body')
            })
        })
    })
 })