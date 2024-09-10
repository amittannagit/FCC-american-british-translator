'use strict';

const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');
const app = require('../server.js'); // Adjust the path if necessary

suite('Functional Tests', () => {

    test('Translation with text and locale fields: POST request to /api/translate', (done) => {
        request(app)
            .post('/api/translate')
            .send({ text: 'Mangoes are my favorite fruit.', locale: 'american-to-british' })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                assert.isNull(err);
                assert.equal(res.body.text, 'Mangoes are my favorite fruit.');
                assert.equal(res.body.translation, 'Mangoes are my <span class="highlight">favourite</span> fruit.');
                done();
            });
    });

    test('Translation with text and invalid locale field: POST request to /api/translate', (done) => {
        request(app)
            .post('/api/translate')
            .send({ text: 'Mangoes are my favorite fruit.', locale: 'invalid-locale' })
            .expect('Content-Type', /json/)
            .expect(400) // Expecting a 400 Bad Request status code
            .end((err, res) => {
                assert.isNull(err);
                assert.deepEqual(res.body, { error: 'Invalid value for locale field' });
                done();
            });
    });

    test('Translation with missing text field: POST request to /api/translate', (done) => {
        request(app)
            .post('/api/translate')
            .send({ locale: 'american-to-british' })
            .expect('Content-Type', /json/)
            .expect(400) // Expecting a 400 Bad Request status code
            .end((err, res) => {
                assert.isNull(err);
                assert.deepEqual(res.body, { error: 'Required field(s) missing' });
                done();
            });
    });

    test('Translation with missing locale field: POST request to /api/translate', (done) => {
        request(app)
            .post('/api/translate')
            .send({ text: 'Mangoes are my favorite fruit.' })
            .expect('Content-Type', /json/)
            .expect(400) // Expecting a 400 Bad Request status code
            .end((err, res) => {
                assert.isNull(err);
                assert.deepEqual(res.body, { error: 'Required field(s) missing' });
                done();
            });
    });

    test('Translation with empty text: POST request to /api/translate', (done) => {
        request(app)
            .post('/api/translate')
            .send({ text: '', locale: 'american-to-british' })
            .expect('Content-Type', /json/)
            .expect(400) // Expecting a 400 Bad Request status code
            .end((err, res) => {
                assert.isNull(err);
                assert.deepEqual(res.body, { error: 'No text to translate' });
                done();
            });
    });
    

    test('Translation with text that needs no translation: POST request to /api/translate', (done) => {
        request(app)
            .post('/api/translate')
            .send({ text: 'Mangoes are mangoes.', locale: 'american-to-british' })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                assert.isNull(err);
                assert.equal(res.body.text, 'Mangoes are mangoes.');
                assert.equal(res.body.translation, 'Everything looks good to me!');
                done();
            });
    });

});
