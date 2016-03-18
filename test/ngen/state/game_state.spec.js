/**
 * This unit test verifies the behavior of the GameState class within the NGEN framework.
 */
describe( 'GameState', function() {
    describe( '#constructor', function() {
        it( 'Should fail without a name.', function() {
            expect( function() {
                var state = new GameState();
                state.onInitialize();
            }).to.throw(Error);

            expect( function() {
                var desc = {};

                var state = new GameState();
                state.onInitialize( desc );
            }).to.throw(Error);
        });

        it( 'Should construct successfully with a name.', function() {
            expect( function() {
                var desc = {
                    name: 'Example'
                };

                var state = new GameState();
                state.onInitialize( desc );
            }).to.not.throw(Error);
        });
    });
});