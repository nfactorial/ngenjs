'use strict';

describe('StateTree', function () {
    describe('#constructor', function () {
        it('Should construct successfully with no content.', function () {
            var stateTree = new StateTree();
        });
    });

    describe('#onInitialize', function () {
        it('Should successfully create a game state.', function () {
            var stateTable = {
                //
            };

            var stateTree = new StateTree();

            stateTree.onInitialize(stateTable);
        });

        it('Should successfully create a state tree.', function () {
            var stateTable = {
                //
            };

            var stateTree = new StateTree();

            stateTree.onInitialize(stateTable);
        });
    });
});

//# sourceMappingURL=state_tree.spec-compiled.js.map