const initialState = {
    user: {},
    team: {}
}

const UPDATE_USER = 'UPDATE_USER';
const UPDATE_TEAM = 'UPDATE_TEAM';

export const updateUser = (user) => {
    return {
        type: UPDATE_USER,
        payload: user
    }
}

export const updateTeam = (team) => {
    return {
        type: UPDATE_TEAM,
        payload: team
    }
}


export default function reducer(state = initialState, action) {
    switch (action.type) {
        
        case UPDATE_USER:
            return {...state, user: action.payload}

        case UPDATE_TEAM:
            return {...state, team: action.payload}    

        default:
            return state;
    }
}