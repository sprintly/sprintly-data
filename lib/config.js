let config = typeof __sprintly_data_config !== 'undefined' ? __sprintly_data_config : {};

export var BASE_URL = config.BASE_URL || process.env.BASE_URL || 'https://sprint.ly/api';
