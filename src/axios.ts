import axios from 'axios';

export default () => {
  //
  //const  __API__ = 'http://10.100.102.6:5000';
  const  __API__ = 'https://api.themoviedb.org';
  return axios.create({baseURL: __API__});
};
