import app from './app'
import {connectDB} from './db'
import {PORT} from './config'


async function main(){
    
    try {
        await connectDB();
        app.listen(PORT);
        console.log('listening on port', PORT);
    } 
    catch (error) {
        console.error(error);
    }

}


main();

