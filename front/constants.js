export const Q_FUNC_TYPE_OPTIONS = {
  mean: 'MEAN',
  qr: 'QUANTILE REGRESSION',
  iqn: 'IMPLICIT QUANTILE NETWORK'
}

export const SCALER_OPTIONS = {
  null: 'NONE',
  standard: 'STANDARDIZATION',
  min_max: 'MIN MAX',
  pixel: 'PIXEL'
}

export const IMAGE_AUGMENTATION_OPTIONS = {
  random_shift: 'RANDOM SHIFT',
  random_rotation: 'RANDOM ROTATION',
  cutout: 'CUTOUT',
  horizontal_flip: 'HORIZONTAL FLIP',
  vertical_flip: 'VERTICAL FLIP',
  intensity: 'INTENSITY',
  color_jitter: 'COLOR JITTER'
}

export const VECTOR_AUGMENTATION_OPTIONS = {
  single_amplitude_scaling: 'SINGLE AMPLITUDE SCALING',
  multiple_amplitude_scaling: 'MULTIPLE AMPLITUDE SCALING'
}

export const COMMON_CONFIGS = {
  basic_config: {
    n_epochs: 100,
    q_func_type: 'mean',
    scaler: null,
    n_frames: 4,
    batch_size: 100,
    use_gpu: null
  },
  advanced_config: {
    n_steps: 1,
    gamma: 0.99,
    n_critics: 1,
    bootstrap: false,
    share_encoder: false,
    augmentation: [],
    n_augmentations: 1
  }
}

export const CONTINUOUS_CONFIGS = {
  awac: {
    actor_learning_rate: 3e-4,
    critic_learning_rate: 3e-4,
    batch_size: 256,
    tau: 0.005,
    lam: 1.0,
    n_action_samples: 1,
    n_critics: 2
  },
  awr: {
    actor_learning_rate: 5e-5,
    critic_learning_rate: 1e-4,
    batch_size: 2048,
    batch_size_per_update: 256,
    n_actor_updates: 1000,
    n_critic_updates: 200,
    lam: 0.95,
    beta: 1.0,
    max_weight: 20.0
  },
  bcq: {
    actor_learning_rate: 1e-3,
    critic_learning_rate: 1e-3,
    imitator_learning_rate: 1e-3,
    batch_size: 100,
    tau: 0.005,
    update_actor_interval: 1,
    lam: 0.75,
    n_action_samples: 100,
    action_flexibility: 0.05,
    rl_start_epoch: 0,
    latent_size: 32,
    beta: 0.5,
    n_critics: 2
  },
  bear: {
    actor_learning_rate: 3e-4,
    critic_learning_rate: 3e-4,
    imitator_learning_rate: 1e-3,
    temp_learning_rate: 3e-4,
    alpha_learning_rate: 1e-3,
    batch_size: 100,
    tau: 0.005,
    update_actor_interval: 1,
    initial_temperature: 1.0,
    initial_alpha: 1.0,
    alpha_threshold: 0.05,
    lam: 0.75,
    n_action_samples: 4,
    mmd_sigma: 20.0,
    rl_start_epoch: 0,
    n_critics: 2
  },
  cql: {
    actor_learning_rate: 3e-5,
    critic_learning_rate: 3e-4,
    temp_learning_rate: 3e-5,
    alpha_learning_rate: 3e-4,
    batch_size: 256,
    tau: 0.005,
    update_actor_interval: 1,
    initial_temperature: 1.0,
    initial_alpha: 5.0,
    alpha_threshold: 10.0,
    n_action_samples: 10,
    n_critics: 2
  },
  ddpg: {
    actor_learning_rate: 3e-4,
    critic_learning_rate: 3e-4,
    batch_size: 100,
    tau: 0.005
  },
  plas: {
    actor_learning_rate: 3e-4,
    critic_learning_rate: 3e-4,
    imitator_learning_rate: 3e-4,
    batch_size: 256,
    tau: 0.005,
    lam: 0.75,
    action_flexibility: 0.05,
    update_actor_interval: 1,
    rl_start_epoch: 20,
    beta: 0.5,
    n_critics: 2
  },
  sac: {
    actor_learning_rate: 3e-4,
    critic_learning_rate: 3e-4,
    temp_learning_rate: 3e-4,
    batch_size: 256,
    tau: 0.005,
    n_critics: 2,
    update_actor_interval: 1,
    initial_temperature: 1.0
  },
  td3: {
    actor_learning_rate: 3e-4,
    critic_learning_rate: 3e-4,
    batch_size: 256,
    tau: 0.005,
    target_smoothing_sigma: 0.2,
    target_smoothing_clip: 0.5,
    update_actor_interval: 2,
    n_critics: 2
  }
}

export const DISCRETE_CONFIGS = {
  awr: {
    actor_learning_rate: 5e-5,
    critic_learning_rate: 1e-4,
    batch_size: 2048,
    batch_size_per_update: 256,
    n_actor_updates: 1000,
    n_critic_updates: 200,
    lam: 0.95,
    beta: 1.0,
    max_weight: 20.0
  },
  bcq: {
    learning_rate: 6.25e-5,
    batch_size: 32,
    action_flexibility: 0.3,
    beta: 0.5
  },
  cql: {
    learning_rate: 6.25e-5,
    batch_size: 32,
    target_update_interval: 8000
  },
  dqn: {
    learning_rate: 6.25e-5,
    batch_size: 32,
    target_update_interval: 8000
  },
  double_dqn: {
    learning_rate: 6.25e-5,
    batch_size: 32,
    target_update_interval: 8000
  },
  sac: {
    actor_learning_rate: 3e-4,
    critic_learning_rate: 3e-4,
    temp_learning_rate: 3e-4,
    batch_size: 64,
    initial_temperature: 1.0,
    target_update_interval: 8000,
    n_critics: 2
  }
}

// Scalar values
export const STATUS_API_CALL_INTERVAL = 5000
export const FETCH_EXPERIMENTS_INTERVAL = 5000
export const DISPLAY_DECIMAL_LENGTH = 2
export const GRAPH_DIMMED_OPACITY = 0.1
