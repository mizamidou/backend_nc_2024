const request = require('supertest')
const app= require('../app')
const db= require('../db/connection')
const seed =require('../db/seeds/seed')
const testData= require('../db/data/test-data')
const fs=require('fs').promises

beforeEach(() => {seed(testData)})
afterAll(() =>db.end())



describe("api/topics" ,()=>{
    test("GET:array of objects topics with slug and description property", ()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) =>{
            expect(Array.isArray(response.body.topics)).toBe(true)
            expect(response.body.length).toBe(3)
            response.body.topics.forEach((topic) =>{
            expect(typeof topic.slug).toBe('string')
            expect(typeof topic.description).toBe('string')
            })
        })
    })
    
    test("the request is returning invalid parameters", ()=>{
        return request(app)
        .get('/api/topics')
        .expect(400)
        .then((response) =>{
            expect(response.body.msg).toBe('Bad request')
            })
        })
})

