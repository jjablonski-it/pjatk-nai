# 'Inspired' by https://www.youtube.com/watch?v=bD6V3rcr_54

import gymnasium as gym
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten
from tensorflow.keras.optimizers import Adam
from rl.agents import DQNAgent
from rl.policy import BoltzmannQPolicy
from rl.memory import SequentialMemory

env = gym.make('CartPole-v0')
states = env.observation_space.shape[0]
actions = env.action_space.n

# Random agent
episodes = 10
for episode in range(1, episodes+1):
    state = env.reset()
    done = False
    score = 0

    while not done:
        action = env.action_space.sample()
        n_state, reward, done, info = env.step(action)
        score += reward
    print('Episode: {} reward: {}'.format(episode, score))
    # Episode: 1 reward: 13.0
    # Episode: 2 reward: 17.0
    # Episode: 3 reward: 51.0
    # Episode: 4 reward: 15.0
    # Episode: 5 reward: 11.0
    # Episode: 6 reward: 19.0
    # Episode: 7 reward: 18.0
    # Episode: 8 reward: 22.0
    # Episode: 9 reward: 14.0
    # Episode: 10 reward: 11.0


def build_model(states, actions):
    """
    Build a neural network with 2 hidden layers
    :param states: number of states
    :param actions: number of actions
    :return: a compiled neural network model
    """
    model = Sequential()
    model.add(Flatten(input_shape=(1, states)))
    model.add(Dense(24, activation='relu'))
    model.add(Dense(24, activation='relu'))
    model.add(Dense(actions, activation='linear'))
    return model


def build_agent(model, actions):
    """
    Build a reinforcement learning agent
    :param model: a compiled neural network model
    :param actions: number of actions
    :return: a reinforcement learning agent
    """
    policy = BoltzmannQPolicy()
    memory = SequentialMemory(limit=50000, window_length=1)
    dqn = DQNAgent(model=model, memory=memory, policy=policy,
                   nb_actions=actions, nb_steps_warmup=10, target_model_update=1e-2)
    return dqn


model = build_model(states, actions)
dqn = build_agent(model, actions)
dqn.compile(Adam(lr=1e-3), metrics=['mae'])

# Train the agent
dqn.fit(env, nb_steps=1000, visualize=False, verbose=1)

scores = dqn.test(env, nb_episodes=episodes, visualize=False)
print(np.mean(scores.history['episode_reward']))
# Testing for 10 episodes ...
# Episode 1: reward: 200.000, steps: 200
# Episode 2: reward: 200.000, steps: 200
# Episode 3: reward: 200.000, steps: 200
# Episode 4: reward: 200.000, steps: 200
# Episode 5: reward: 200.000, steps: 200
# Episode 6: reward: 200.000, steps: 200
# Episode 7: reward: 200.000, steps: 200
# Episode 8: reward: 200.000, steps: 200
# Episode 9: reward: 200.000, steps: 200
# Episode 10: reward: 199.000, steps: 199
