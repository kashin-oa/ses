# import matplotlib.pyplot as plt
# import networkx as nx
#
# G = nx.Graph()
# nx.draw(G, with_labels=True)
# plt.show()

# import networkx as nx
# import matplotlib.pyplot as plt;

# plt.ion()
# import netgraph
# import netgraph
# import flask

# G = nx.Graph()
# G.add_node(1)
# G.add_node(2)
# G.add_node(3)
# G.add_edge(1, 2)
# nx.draw(G, with_labels=True)
# H = nx.path_graph(200)

# nx.draw(H)

# Make a standard plot:
# netgraph.draw(H)

# Create an interactive plot.
# NOTE: you must retain a reference to the object instance!
# Otherwise the whole thing will be garbage collected after the initial draw
# and you won't be able to move the plot elements around.
# plot_instance = netgraph.InteractiveGraph(H)

# The position of the nodes can be adjusted with the mouse.
# To access the new node positions:
# node_positions = plot_instance.node_positions
# plt.show(block=True)

#%%
import numpy as np
import scipy as sp
from scipy.optimize import linprog


def get_v_matrix(vm, am, pm, steps):
    v_m = vm[:, :]
    for n in range(1, steps + 1):
        v_part = v_m[:, [n - 1]]
        for i in range(0, n):
            v_part += np.linalg.matrix_power(am, n - i - 1) @ pm[:, [i]]
        v_m = np.append(v_m, v_part, 1)
    return v_m


def stairs_rows(arr, rows_num, cols_num):
    zeros = np.zeros([rows_num, cols_num])
    stacked = np.array([])
    for i in range(rows_num):
        stacked = np.hstack([arr[i], stacked])
        zeros[i, :stacked.size] = stacked
    return zeros


def get_equality_matrix(subjects_rows, elements_count, repeats):
    ones = np.ones(elements_count)
    ones[subjects_rows] = 0
    # first elements is ones cause p0 is already known
    eq = np.hstack([np.ones(elements_count), np.tile(ones, repeats - 1)])
    return np.diag(eq)


def get_powers_matrix(mx, max_power, row_num):
    pws = np.array([np.linalg.matrix_power(mx, p)[row_num] for p in range(max_power + 1)])
    # pws[0] = np.ones(pws.shape[1])
    return pws


def get_bounds(b_size):
    bounds = [(None, None) for i in range(b_size)]
    return bounds


def get_linear_prog_solution(mx_a, tg_row_num, subjects_rows, c_matrix, steps, p0=np.array([])):
    nodes_count = mx_a.shape[0]
    c_flat = c_matrix.flatten()
    c_absolute = np.absolute(c_flat)
    a_powers = get_powers_matrix(mx_a, steps, tg_row_num)

    stairs_a = stairs_rows(a_powers, steps, c_flat.size)
    ineq_result = np.zeros(stairs_a.shape[0])

    equation_a = get_equality_matrix(subjects_rows, nodes_count, steps)
    eq_result = np.zeros(equation_a.shape[1])
    eq_result[:p0.size] = p0

    bounds = get_bounds(eq_result.size)

    # result = linprog(c_flat, -stairs_a, ineq_result)
    result = linprog(c_absolute, -stairs_a, ineq_result, equation_a, eq_result, bounds=bounds)
    return result


steps_count = 11

test_a = np.array([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [-1, 0, -2, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 1, 0, 0, -1],
    [0, 0, 0, 0, 0, -1, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, -1],
    [0, 0, -1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, -1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, -1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 1, 0, -1, -1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
], 'float64')

test_p = np.array([
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
], 'float64')

test_c = np.array([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
], 'float64')

test_v = np.array([[3], [5], [4], [5], [6], [3], [2], [6], [3], [4], [3]], 'float64')

subjects_rows = [4, 9, 10]
# subjects_rows = [4]
target_row_number = 6

# full_v = get_v_matrix(test_v, test_a, test_p, steps_count)
# sol_p = get_linear_prog_solution(test_a[:5, :5], target_row_number, subjects_rows, test_c[:5, :3], steps_count, test_p[:5, 0])
# sol_p = get_linear_prog_solution(test_a, target_row_number, subjects_rows, test_c, steps_count, test_p[:, 0])
# print(sol_p)

a_powers = get_powers_matrix(test_a, steps_count, target_row_number)
a_stairs = stairs_rows(a_powers, steps_count, test_a.size)

print(np.flip(a_powers.transpose(), axis=1))
