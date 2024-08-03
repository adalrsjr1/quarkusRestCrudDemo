import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';
import { SharedArray } from 'k6/data';

const users = __ENV.USERS ? parseInt(__ENV.USERS) : 1;
const rampUp = __ENV.RAMPUP ? parseInt(__ENV.RAMPUP) : 1;
const duration = __ENV.DURATION ? parseInt(__ENV.DURATION) : 3600;
const maxThinkTime = __ENV.MAX_THINK_TIME ? parseInt(__ENV.MAX_THINK_TIME) : 200;
const minThinkTime = __ENV.MIN_THINK_TIME ? parseInt(__ENV.MIN_THINK_TIME) : 100;
const host = __ENV.HOST ? __ENV.HOST : 'localhost';
const port = __ENV.PORT ? parseInt(__ENV.PORT) : 30088;
const baseURL = `http://${host}:${port}`;

const fruitCounter = new Counter('fruit_counter');

export let options = {
    stages: [
        { duration: `${rampUp}s`, target: users },
        { duration: `${duration}s`, target: users },
        { duration: '10s', target: 0 },
    ],
};

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomThinkTime() {
    return randomInt(minThinkTime, maxThinkTime) / 1000;
}

export default function () {
    // POST request
    let postData = JSON.stringify({
        name: `fruit_${__VU}_${Date.now()}_${randomInt(0, 10)}`,
    });
    let postRes = http.post(`${baseURL}/fruits`, postData, {
        headers: { 'Content-Type': 'application/json' },
    });
    check(postRes, {
        'POST status was 200': (r) => r.status === 200,
    });
    let responseData = postRes.json();
    let id = responseData.id;

    fruitCounter.add(1);

    // Loop 10 times for GET_ALL and GET
    for (let i = 0; i < 10; i++) {
        // GET_ALL request
        let getAllRes = http.get(`${baseURL}/fruits`);
        check(getAllRes, {
            'GET_ALL status was 200': (r) => r.status === 200,
        });

        sleep(randomThinkTime());

        // GET request
        let getRes = http.get(`${baseURL}/fruits/${id}`);
        check(getRes, {
            'GET status was 200': (r) => r.status === 200,
        });

        sleep(randomThinkTime());
    }

    // PUT request
    let putData = JSON.stringify({
        name: `fruit_${__VU}_${Date.now()}`,
    });
    let putRes = http.put(`${baseURL}/fruits/${id}`, putData, {
        headers: { 'Content-Type': 'application/json' },
    });
    check(putRes, {
        'PUT status was 200': (r) => r.status === 200,
    });

    sleep(randomThinkTime());

    // DELETE request
    let delRes = http.del(`${baseURL}/fruits/${id}`);
    check(delRes, {
        'DELETE status was 200': (r) => r.status === 200,
    });

    sleep(randomThinkTime());
}

