import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from "axios-mock-adapter";
import { MemoryRouter } from 'react-router-dom';
import UserPageSideBar from '../UserPageSideBar';
import { AuthProvider } from '../../store/AuthContext';

let axiosMock;

beforeEach(() => {
    axiosMock = new MockAdapter(axios);
});

//after each test, reset the mock
afterEach(() => {
    fireEvent.scroll(window, { target: { scrollY: 0 } });
    axiosMock.reset();
});

const groupData =
{
    "groupName": "test",
    "createDate": {
        "$date": "2024-04-27T10:04:10.278Z"
    },
    "deadlineDate": {
        "$date": "2024-05-10T00:00:00.000Z"
    },
    "groupMembers": [
        {
            "$oid": "662ccd4711518ce71db1625b"
        },
        {
            "$oid": "662cce1911518ce71db162be"
        },
        {
            "$oid": "662dd908f0dd8649a643c3a9"
        },
        {
            "$oid": "662dd912f0dd8649a643c3ac"
        },
        {
            "$oid": "662eec8516bc5ddc162f1fae"
        }
    ],
    "groupDescription": "hahaha",
    "groupTags": [
        {
            "$oid": "662ccd9a11518ce71db16267"
        }
    ],
    "ownerId": {
        "$oid": "662ccd4711518ce71db1625b"
    },
    "groupStatus": "available",
    "groupType": "group",
    "maxNumber": 6,
    "likeNumber": 1,
    "__v": 11
}


describe('UserPageSideBar Component', () => {



});
