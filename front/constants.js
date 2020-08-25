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

export const CONTINUOUS_CONFIGS = {
  cql: {
    basic_config: {
      n_epochs: 100,
      q_func_type: 'mean',
      scaler: null,
      batch_size: 100,
      use_gpu: null
    },
    advanced_config: {
      n_critics: 2,
      bootstrap: false,
      augmentation: [],
      n_augmentations: 1,
      actor_learning_rate: 3e-5,
      critic_learning_rate: 3e-4,
      temp_learning_rate: 3e-5,
      alpha_learning_rate: 3e-4,
      gamma: 0.99,
      use_batch_norm: false,
      tau: 0.005,
      share_encoder: false,
      update_actor_interval: 1,
      initial_temperature: 1.0,
      initial_alpha: 5.0,
      alpha_threshold: 10.0,
      n_action_samples: 10,
      eps: 1e-8
    }
  }
}

export const DISCRETE_CONFIGS = {
  cql: {
    basic_config: {
      n_epochs: 100,
      q_func_type: 'mean',
      scaler: null,
      batch_size: 32,
      use_gpu: null
    },
    advanced_config: {
      n_critics: 1,
      bootstrap: false,
      augmentation: [],
      n_augmentations: 1,
      learning_rate: 6.25e-5,
      gamma: 0.99,
      use_batch_norm: false,
      target_update_interval: 8000,
      share_encoder: false,
      eps: 1.5e-4
    }
  }
}

// Scalar values
export const STATUS_API_CALL_INTERVAL = 5000
export const FETCH_EXPERIMENTS_INTERVAL = 5000
export const DISPLAY_DECIMAL_LENGTH = 2
export const GRAPH_DIMMED_OPACITY = 0.1
