import { init as initState } from './state';
import { init as initCommands } from './commands';
import { init as initNavigation, switchPage } from './navigation';
import router from './router';

initState();
initCommands();
initNavigation(router);
switchPage('index');
