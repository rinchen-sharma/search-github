import { ActionTypes } from './store.actions';

const initialState: any = {
    user: {},
    repo: {},
    searchTerm: '',
    searchType: ''
};

export function appReducer(state = initialState, action: any): any {
    const id = action.id;
    const payload = action.payload;
    const searchType = action.searchType;
    let newItems = '';
    let obj: any = { user: {}, repo: {} };


    switch (action.type) {
        case ActionTypes.AddUsers:
            obj.user = { ...state.user, [id]: payload };
            obj.repo = { ...state.repo };
            return obj;
        case ActionTypes.AddRepos:
            obj.user = { ...state.user };
            obj.repo = { ...state.repo, [id]: payload };
            return obj;
        case ActionTypes.UpdateSearchTerm:
            obj = { ...state, searchTerm: payload };
            return obj;
        case ActionTypes.UpdateSearchType:
            obj = { ...state, searchType: payload };
            return obj;
        case ActionTypes.UpdateUsers:
            newItems = state.user[id].items.concat(payload.items);
            obj.user = { ...state.user, [id]: {...state.user[id], items: newItems} };
            return obj;
        case ActionTypes.UpdateRepos:
            newItems = state.repo[id].items.concat(payload.items);
            obj.repo = { ...state.repo, [id]: {...state.repo[id], items: newItems} };
            return obj;
        default:
            return state;
    }
}
