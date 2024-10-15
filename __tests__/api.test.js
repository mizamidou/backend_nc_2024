const request = require('supertest')
const app= require('../app')
const db= require('../db/connection')
const seed =require('../db/seeds/seed')
const testData= require('../db/data/test-data')


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
            expect(response.body.msg).toBe('The request root doesnt exist')
            })
        })


    test("GET:invalid slug has been provided", ()=>{
        return request(app)
        .get('/api/topics/invalidSlug')
        .expect(404)
        .then((response) =>{
            //expect(response.body.status).toBe(404)
            expect(response.body.msg).toBe('Invalid point')
            })
        })
})

