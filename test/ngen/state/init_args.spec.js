

describe( 'InitArgs', function() {
    describe( '#constructor', function() {
        it( 'Should fail without state tree.', function() {
            expect( function() {
                new InitArgs();
            }).to.throw( Error );
        });

        it( 'Should construct successfully with a state tree.', function() {
            expect( function() {
                var stateTree = {};

                new InitArgs(stateTree);
            }).to.not.throw( Error );
        });
    });
});